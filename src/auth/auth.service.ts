import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginDTO, UsersDTO } from './dto/users.dto';
import { validate } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../database/entities/users.entity';
import { Repository } from 'typeorm';
import { compareSync, hash } from 'bcryptjs';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import {AuthResponse, CompaniesListResponse, Company, UserAuthResponse, UserListResponse} from './auth.model';
import * as process from 'process';
import * as http from "http";
import { ArticlePartner } from "../database/entities/article.partner.entity";

@Injectable()
export class AuthService {
  constructor(
    private logger: LoggerService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(ArticlePartner) private articlesPartnersRepository: Repository<ArticlePartner>,
  ) { }

  async login(user: any): Promise<AuthResponse> {
    let isOk = false;
    const userDTO = new LoginDTO();
    userDTO.email = user.email;
    userDTO.password = user.password;

    await validate(userDTO).then((errors) => {
      if (errors.length > 0) {
        this.logger.debug(`${errors}`, AuthService.name);
      } else {
        isOk = true;
      }
    });

    if (isOk) {
      const userDetails = await this.usersRepository.findOne({
        where: { email: user.email },
      });

      if (userDetails == null) {
        return { status: HttpStatus.NOT_FOUND, devMessage: 'Id not found (AuthService:login:userDetails)', userMessage: 'L\'identifiant spécifié n\'a pas été trouvé.' };
      }

      const isValid = compareSync(user.password, userDetails.password);
      if (isValid) {
        const expiresIn = '64h';
        const response = {
          status: 200,
          devMessage: 'Login successfully',
          userMessage: 'Connexion réussie ! Bienvenue sur notre plateforme.',
          content: {
            email: user.email,
            access_token: this.jwtService.sign(
              { email: user.email, isDeveloper: userDetails.isDeveloper },
              { expiresIn },
            ),
          },
        };
        return response;
      } else {
        return { status: HttpStatus.NOT_FOUND, devMessage: 'Id not found (AuthService:login:isValid)', userMessage: 'L\'identifiant spécifié n\'a pas été trouvé.' };
      }
    } else {
      return { status: HttpStatus.BAD_REQUEST, devMessage: 'Invalid content (AuthService:login:isOk)', userMessage: 'Une erreur est survenue lors de la connection. Veuillez réessayer plus tard.' };
    }
  }

  async findAll(): Promise<UserListResponse> {
    try {
      const users = await this.usersRepository.find();
      const userList = users.map(userFound => ({
        id: userFound.id,
        email: userFound?.email ?? '',
        password: userFound?.password ?? '',
        name: userFound?.name ?? '',
        lastName: userFound?.lastName ?? '',
        businessRole: userFound?.businessRole ?? '',
        businessContact: userFound?.businessContact ?? '',
        businessName: userFound?.businessName ?? '',
        isConfirmed: userFound?.isConfirmed ?? false,
        isDeveloper: userFound?.isDeveloper ?? false,
        businessAdress: userFound?.businessAdress ?? '',
        businessZipCode: userFound?.businessZipCode ?? '',
        businessCity: userFound?.businessCity ?? '',
        businessCountry: userFound?.businessCountry ?? '',
        businessDescription: userFound?.businessDescription ?? '',
        business_logo: userFound?.business_logo.toString('utf-8') ?? '',
        profil_picture: userFound?.profil_picture.toString('utf-8') ?? '',
      }));
      return { status: HttpStatus.OK, users: userList };
    } catch (error) {
      console.error('Error while retrieving users:', error);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR,  users: [null] };
    }  
  }

  async createUser(body: any, req): Promise<AuthResponse> {
    let isOk = false;
    const userDTO = new UsersDTO();

    userDTO.email = body.email;
    userDTO.password = await hash(body.password, 10);
    userDTO.name = body.name;
    userDTO.lastName = body.lastName;
    userDTO.businessRole = body.businessRole;
    userDTO.businessContact = body.businessContact;
    userDTO.businessName = body.businessName;
    userDTO.business_logo = Buffer.from(body.business_logo, 'utf-8');
    userDTO.profil_picture = Buffer.from(body.profil_picture, 'utf-8');
    userDTO.businessDescription = body.businessDescription;
    userDTO.businessLink = body.businessLink;
    userDTO.confirmationToken = uuidv4();


    if ('isDevelopper' in body) {
      userDTO.isDevelopper = body.isDevelopper;
    } else {
      userDTO.isDevelopper = false;
    }
    await validate(userDTO).then((errors) => {
      if (errors.length > 0) {
        this.logger.debug(`${errors}`, AuthService.name);
      } else {
        isOk = true;
      }
    });
    if (isOk) {
      await this.usersRepository.save(userDTO).catch((error) => {
        this.logger.debug(error.message, AuthService.name);
        isOk = false;
      });
      if (isOk) {
        const protocol = req.protocol;
        const hostname = req.hostname;
        const originalUrl = req.originalUrl;
        let templateData;

        if (process.env.NODE_ENV === 'development') {
          templateData = {
            confirmationLink: `${protocol}://${hostname}:3002/confirm?token=${userDTO.confirmationToken}`,
          };
        } else {
          templateData = {
            confirmationLink: `${protocol}://${hostname}/confirm?token=${userDTO.confirmationToken}`,
          };
        }

        await this.mailService.sendMailWithTemplate(
          userDTO.email,
          "Confirmation d'inscription",
          'confirmationLink',
          templateData,
        );
        const expiresIn = '64h';
        return {
          status: HttpStatus.OK,
          devMessage: `OK`,
          userMessage: 'Inscription réussie ! Bienvenue sur notre plateforme. Vous êtes maintenant prêt à explorer notre site.',
          content: {
            access_token: this.jwtService.sign(
              { email: userDTO.email, isDeveloper: false },
              { expiresIn },
            ),
          },
        };
      } else {
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          devMessage: 'A problem occurred with the repository (AuthService:createUser:save)',
          userMessage: 'Une erreur est survenue lors de la création de votre compte. Veuillez réessayer plus tard.'
        };
      }
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        devMessage: 'Invalid content (AuthService:createUser:DTO)',
        userMessage: 'Une erreur est survenue lors de la création de l\'user. Veuillez réessayer plus tard.'
      };
    }
  }

  async deleteUserConnected(req: any): Promise<AuthResponse> {
    const jwt = require('jsonwebtoken');

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return new Promise<AuthResponse>(async (resolve) => {
      jwt.verify(token, '123456', async (err, decodedToken) => {
        if (err) {
          console.error(err);
          resolve({
            status: HttpStatus.FORBIDDEN,
            devMessage: 'Invalid token (AuthService:deleteUserConnected:token)',
            userMessage: 'Vous n\'avez pas les autorisations nécessaires pour supprimer cet user.'
          });
          return;
        }

        try {
          const userInfo = await this.usersRepository.findOne({
            where: { email: decodedToken.email },
          });

          if (!userInfo) {
            resolve({
              status: HttpStatus.NOT_FOUND,
              devMessage: 'Id not found (AuthService:deleteUserConnected:userInfo)',
              userMessage: 'L\'identifiant spécifié n\'a pas été trouvé.'
            });
            return;
          }

          const deleteResult = await this.usersRepository.delete({
            email: decodedToken.email,
          });

          if (deleteResult.affected === 0) {
            resolve({
              status: HttpStatus.FORBIDDEN,
              devMessage: 'Invalid token (AuthService:deleteUserConnected:delete)',
              userMessage: 'Vous n\'avez pas les autorisations nécessaires pour supprimer cet user.'
            });
            return;
          }

          await this.articlesPartnersRepository.delete({ email: decodedToken.email });

          resolve({
            status: HttpStatus.OK,
            devMessage: 'OK',
            userMessage: 'Votre compte a été supprimé avec succès.',
          });
        } catch (error) {
          console.error(error.message);
          resolve({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            devMessage: 'A problem occurred with the repository (AuthService:deleteUserConnected:delete)',
            userMessage: 'Une erreur est survenue lors de la création de l\'user. Veuillez réessayer plus tard.'
          });
        }
      });
    });
  }

  async userAskDev(req: any): Promise<AuthResponse> {
    const jwt = require('jsonwebtoken');

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return new Promise<AuthResponse>(async (resolve) => {
      jwt.verify(token, '123456', async (err, decodedToken) => {
        if (err) {
          console.error(err);
          resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token (AuthService:userAskDev:token)' });
          return;
        }
        try {
          const userInfo = await this.usersRepository.findOne({
            where: { email: decodedToken.email },
          });
          if (userInfo && userInfo.isDeveloper === true) {
            resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Already dev permission (AuthService:userAskDev:isDeveloper)' });
          } else if (userInfo && userInfo.isConfirmed === false) {
            resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'You need to confirm your account (AuthService:userAskDev:isConfirmed)' });
          } else {
            const protocol = req.protocol;
            const hostname = req.hostname;
            const originalUrl = req.originalUrl;
            let templateData;

            if (process.env.NODE_ENV === 'development') {
              templateData = {
                confirmationLink: `${protocol}://${hostname}:3002/confirm_dev?email=${userInfo.email}`,
              };
            } else {
              templateData = {
                confirmationLink: `${protocol}://${hostname}/confirm_dev?email=${userInfo.email}`,
              };
            }
            await this.mailService.sendMailWithTemplate(
              "localshirt.eip@gmail.com",
              'Demande de permission dev de ' + userInfo.email,
              'askToBeDevelopper',
              templateData,
            );
            resolve({ status: HttpStatus.OK, devMessage: 'OK' });
          }
        } catch (error) {
          console.error(error.message);
          resolve({ status: HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (AuthService:userAskDev:sendMailWithTemplate)' });
          return;
        }
      });
    });
  }

  async giveDevPermission(email: string): Promise<AuthResponse> {
    try {
      const user = await this.usersRepository.findOne({ where: { email: email } });

      if (!user) {
        return { status: HttpStatus.NOT_FOUND, devMessage: 'User not found (AuthService:giveDevPermission:user)' };
      }

      if (user.isDeveloper === true) {
        return { status: HttpStatus.FORBIDDEN, devMessage: 'Already dev permission (AuthService:giveDevPermission:isDeveloper)' };
      }
      user.isDeveloper = true;
      await this.usersRepository.save(user);

      return { status: HttpStatus.OK, devMessage: 'OK' };
    } catch (error) {
      console.error(error.message);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (AuthService:giveDevPermission:save)' };
    }
  }

  async deleteByDeveloper(id: string, req: any): Promise<AuthResponse> {
    const jwt = require('jsonwebtoken');

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return new Promise<AuthResponse>(async (resolve) => {
      jwt.verify(token, '123456', async (err, decodedToken) => {
        if (err) {
          console.error(err);
          resolve({
            status: HttpStatus.FORBIDDEN,
            devMessage: 'Invalid token (AuthService:deleteByDeveloper:token)',
          });
          return;
        }

        try {
          const userInfo = await this.usersRepository.findOne({
            where: { email: decodedToken.email },
          });
          if (userInfo && userInfo.isDeveloper === true) {
            const deleteResult = await this.usersRepository.delete(id);

            const userInfo = await this.usersRepository.findOne({
              where: { id: id },
            });

            await this.articlesPartnersRepository.delete({
              email: userInfo.email,
            });

            if (deleteResult.affected === 0) {
              resolve({ status: HttpStatus.NOT_FOUND, devMessage: 'Id not found (AuthService:deleteByDeveloper:delete)' });
              return;
            }

            resolve({
              status: HttpStatus.OK,
              devMessage: 'OK',
            });
          } else {
            resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token (AuthService:deleteByDeveloper:isDeveloper)' });
            return;
          }
        } catch (error) {
          console.error(error.message);
          resolve({ status: HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (AuthService:deleteByDeveloper:catch)' });
          return;
        }
      });
    });
  }

  async confirmRegistration(token: string): Promise<AuthResponse> {
    const user = await this.usersRepository.findOne({
      where: { confirmationToken: token },
    });

    if (!user) {
      throw new Error('Token de confirmation invalide.');
    }

    user.isConfirmed = true;
    user.confirmationToken = null;
    await this.usersRepository.save(user);

    return {
      status: HttpStatus.OK,
      devMessage: 'OK',
      userMessage: 'Votre compte est maintenant confirmé.',
      content: { email: user.email }
    };
  }

  async send_email_password(body, req): Promise<Record<string, any>> {
    const userDetails = await this.usersRepository.findOne({
      where: { email: body.email },
    });
    if (userDetails == null) {
      return { status: HttpStatus.BAD_REQUEST, msg: { msg: 'Invalid content' } };
    }
    userDetails.resetPassword = true;
    userDetails.resetPasswordReference = uuidv4();

    const protocol = req.protocol;
    const hostname = req.hostname;

    let templateData;

    if (process.env.NODE_ENV === 'development') {
      templateData = {
        confirmationLink: `${protocol}://${hostname}:3002/password/${userDetails.resetPasswordReference}`,
      };
    } else {
      templateData = {
        confirmationLink: `${protocol}://${hostname}/password/${userDetails.resetPasswordReference}`,
      };
    }
    await this.mailService.sendMailWithTemplate(
      userDetails.email,
      'Forget password',
      'forgetPassword',
      templateData,
    );

    await this.usersRepository.save(userDetails);

    return { status: HttpStatus.OK, content: { msg: `OK` }, devMessage: "OK" };
  }

  async updateConnectedUser(body, req): Promise<Record<string, any>> {
    const jwt = require('jsonwebtoken');

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return new Promise<AuthResponse>(async (resolve) => {
      jwt.verify(token, '123456', async (err, decodedToken) => {
        if (err) {
          console.error(err);
          resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token (AuthService:updateConnectedUser:token)', userMessage: 'Vous n\'avez pas les autorisations nécessaires pour supprimer cet article.' });
          return;
        }
        try {
          const userInfo = await this.usersRepository.findOne({
            where: { email: decodedToken.email },
          });

          if (!userInfo) {
            resolve({ status: HttpStatus.NOT_FOUND, devMessage: 'Id not found (AuthService:updateConnectedUser:userInfo)', userMessage: 'L\'identifiant spécifié n\'a pas été trouvé.' });
            return;
          }

          const propertiesToUpdate = [
            'name',
            'lastName',
            'businessName',
            'businessRole',
            'businessContact',
            'businessAdress',
            'businessZipCode',
            'businessCity',
            'businessCountry',
            'isConfirmed',
            'isDeveloper',
            'businessDescription',
            'business_logo',
            'profil_picture',
          ];

          propertiesToUpdate.forEach((property) => {
            if (body[property] !== 'null' && (property === "business_logo" || property === "profil_picture")) {
              userInfo[property] = Buffer.from(body[property], 'utf-8');
            } else if (body[property] !== 'null') {
              userInfo[property] = body[property];
            }
          });
          await this.usersRepository.save(userInfo);

          resolve({
            status: HttpStatus.OK,
            devMessage: 'User updated successfully',
            userMessage: 'Votre compte a bien été mis à jour.',
          });
        } catch (error) {
          console.error(error.message);
          resolve({
            status: 500,
            devMessage: 'Internal server error (AuthService:updateConnectedUser:save)',
            userMessage: 'Une erreur est survenue lors de la création de l\'article. Veuillez réessayer plus tard.'
          });
        }
      });
    });
  }

  async UpdateUserByAdmin(body, req): Promise<Record<string, any>> {
    const jwt = require('jsonwebtoken');
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    const decodedToken = jwt.verify(token, '123456');

    if (decodedToken && !decodedToken.isDeveloper) {
      return { status: HttpStatus.FORBIDDEN, devMessage: 'user Forbidden', userMessage: '' };
    }

    return new Promise<AuthResponse>(async (resolve) => {
      try {
        const userInfo = await this.usersRepository.findOne({
          where: { email: body.email},
        });

        if (!userInfo) {
          resolve({ status: HttpStatus.NOT_FOUND, userMessage: 'utilisateur pas trouvé', devMessage: 'User not found' });
          return;
        }

        const propertiesToUpdate = [
          "email",
          'name',
          'lastName',
          'businessName',
          'businessRole',
          'isConfirmed',
          'isDeveloper',
        ];
        propertiesToUpdate.forEach((property) => {
          if (body[property] !== undefined && body[property] !== null) {

            if (typeof userInfo[property] === 'boolean') {
              userInfo[property] = body[property] === true;
            } else {
              userInfo[property] = body[property];
            }
          }
        });

        await this.usersRepository.save(userInfo);
        resolve({
          status: HttpStatus.OK,
          userMessage: "la mise à jour de l'utilisateur a été effectuée avec succès",
          devMessage: 'User updated successfully'
        });
      } catch (error) {
        console.error(error.message);
        resolve({ 
          status: HttpStatus.INTERNAL_SERVER_ERROR, 
          userMessage : "erreur du serveur",
          devMessage: "Internal server error"
        });
      }
    });
  }

  async change_password(body) {
    const userDetails = await this.usersRepository.findOne({
      where: { resetPasswordReference: body.resetPasswordReference },
    });
    if (userDetails == null) {
      return {
        status: HttpStatus.FORBIDDEN,
        content: { msg: "Invalid token" },
        devMessage: "invalid token (AuthService:change_password:userDetails)"
      };
    }
    if (userDetails.resetPassword === false) {
      return { status: HttpStatus.BAD_REQUEST, content: { msg: "Invalid content" }, devMessage: "invalid content (AuthService:change_password:resetPassword)" };
    }
    if (body.password !== body.confirm_password) {
      return { status: HttpStatus.BAD_REQUEST, content: { msg: "Invalid content" }, devMessage: "invalid content (AuthService:change_password:confirm_password)" };
    }
    userDetails.password = await hash(body.password, 10);
    userDetails.resetPasswordReference = null;
    userDetails.resetPassword = false;
    await this.usersRepository.save(userDetails);
    return { status: HttpStatus.OK, content: { msg: `OK` }, devMessage: "OK" };
  }

  async getUser(user): Promise<UserAuthResponse> {
    const userFound = await this.usersRepository.findOne({
      where: { email: user.email },
    });
    if (!userFound)
      return { status: HttpStatus.NOT_FOUND, devMessage: 'Id not found (AuthService:getUser:userFound)', user: null };
    return {
      status: HttpStatus.OK,
      devMessage: `OK`,
      userMessage: `Vos informations ont bien été récupéré.`,
      user: {
        id: userFound.id,
        email: userFound?.email ?? '',
        password: userFound?.password ?? '',
        name: userFound?.name ?? '',
        lastName: userFound?.lastName ?? '',
        businessRole: userFound?.businessRole ?? '',
        businessContact: userFound?.businessContact ?? '',
        businessName: userFound?.businessName ?? '',
        isConfirmed: userFound?.isConfirmed ?? false,
        isDeveloper: userFound?.isDeveloper ?? false,
        businessAdress: userFound?.businessAdress ?? '',
        businessZipCode: userFound?.businessZipCode ?? '',
        businessCity: userFound?.businessCity ?? '',
        businessCountry: userFound?.businessCountry ?? '',
        businessDescription: userFound?.businessDescription ?? '',
        business_logo: userFound?.business_logo.toString('utf-8') ?? '',
        profil_picture: userFound?.profil_picture.toString('utf-8') ?? '',
      },
    };
  }

  async getCompanies(): Promise<CompaniesListResponse> {
    let companies: Company[] = []
    let users = await this.usersRepository.find();

    if (!users) return { status: HttpStatus.NOT_FOUND, content: 'Id not found', companies: [] };
    users.map((user) => {
      if (!companies.find(companies => companies.name === user.businessName))
        try {
          companies.push({ name: user.businessName, logo: user.business_logo.toString('utf-8'), description: user.businessDescription, businessLink: user.businessLink })
        } catch (err) {
          console.error(err);
        }
    })
    return {status: HttpStatus.OK, content: 'OK', companies: companies};
  }

  async updateEmailById(req, id: string, newEmail: string): Promise<AuthResponse> {
    const jwt = require('jsonwebtoken');

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return new Promise<AuthResponse>(async (resolve) => {
      jwt.verify(token, '123456', async (err, decodedToken) => {
        if (err) {
          console.error(err);
          resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token (AuthService:updateEmailById:token)' });
        } else {
          const userInfo = await this.usersRepository.findOne({
            where: { email: decodedToken.email },
          });
          if (userInfo && userInfo.isDeveloper === true) {
            const user = await this.usersRepository.findOne({ where: { id: id } });
            const articles = await this.articlesPartnersRepository.find({ where: { email: user.email } });
            for (const article of articles) {
              article.email = newEmail;
              await this.articlesPartnersRepository.save(article);
            }

            if (!user) {
              resolve({ status: HttpStatus.NOT_FOUND, devMessage: 'User not found (AuthService:updateEmailById:user)' });
            }

            user.email = newEmail;

            await this.usersRepository.save(user);

            resolve({ status: HttpStatus.OK, devMessage: 'OK' });
          } else {
            resolve({ status: HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (AuthService:updateEmailById:save)' });
          }
        }
      });
    });
  }
}
