"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_dto_1 = require("./dto/users.dto");
const class_validator_1 = require("class-validator");
const jwt_1 = require("@nestjs/jwt");
const logger_service_1 = require("../logger/logger.service");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../database/entities/users.entity");
const typeorm_2 = require("typeorm");
const bcryptjs_1 = require("bcryptjs");
const mail_service_1 = require("../mail/mail.service");
const uuid_1 = require("uuid");
const process = require("process");
const article_partner_entity_1 = require("../database/entities/article.partner.entity");
let AuthService = AuthService_1 = class AuthService {
    constructor(logger, jwtService, mailService, usersRepository, articlesPartnersRepository) {
        this.logger = logger;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.usersRepository = usersRepository;
        this.articlesPartnersRepository = articlesPartnersRepository;
    }
    async login(user) {
        let isOk = false;
        const userDTO = new users_dto_1.LoginDTO();
        userDTO.email = user.email;
        userDTO.password = user.password;
        await (0, class_validator_1.validate)(userDTO).then((errors) => {
            if (errors.length > 0) {
                this.logger.debug(`${errors}`, AuthService_1.name);
            }
            else {
                isOk = true;
            }
        });
        if (isOk) {
            const userDetails = await this.usersRepository.findOne({
                where: { email: user.email },
            });
            if (userDetails == null) {
                return { status: common_1.HttpStatus.NOT_FOUND, devMessage: 'Id not found (AuthService:login:userDetails)', userMessage: 'L\'identifiant spécifié n\'a pas été trouvé.' };
            }
            const isValid = (0, bcryptjs_1.compareSync)(user.password, userDetails.password);
            if (isValid) {
                const expiresIn = '64h';
                const response = {
                    status: 200,
                    devMessage: 'Login successfully',
                    userMessage: 'Connexion réussie ! Bienvenue sur notre plateforme.',
                    content: {
                        email: user.email,
                        access_token: this.jwtService.sign({ email: user.email, isDeveloper: userDetails.isDeveloper }, { expiresIn }),
                    },
                };
                return response;
            }
            else {
                return { status: common_1.HttpStatus.NOT_FOUND, devMessage: 'Id not found (AuthService:login:isValid)', userMessage: 'L\'identifiant spécifié n\'a pas été trouvé.' };
            }
        }
        else {
            return { status: common_1.HttpStatus.BAD_REQUEST, devMessage: 'Invalid content (AuthService:login:isOk)', userMessage: 'Une erreur est survenue lors de la connection. Veuillez réessayer plus tard.' };
        }
    }
    async findAll() {
        try {
            const users = await this.usersRepository.find();
            const userList = users.map(userFound => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                return ({
                    id: userFound.id,
                    email: (_a = userFound === null || userFound === void 0 ? void 0 : userFound.email) !== null && _a !== void 0 ? _a : '',
                    password: (_b = userFound === null || userFound === void 0 ? void 0 : userFound.password) !== null && _b !== void 0 ? _b : '',
                    name: (_c = userFound === null || userFound === void 0 ? void 0 : userFound.name) !== null && _c !== void 0 ? _c : '',
                    lastName: (_d = userFound === null || userFound === void 0 ? void 0 : userFound.lastName) !== null && _d !== void 0 ? _d : '',
                    businessRole: (_e = userFound === null || userFound === void 0 ? void 0 : userFound.businessRole) !== null && _e !== void 0 ? _e : '',
                    businessContact: (_f = userFound === null || userFound === void 0 ? void 0 : userFound.businessContact) !== null && _f !== void 0 ? _f : '',
                    businessName: (_g = userFound === null || userFound === void 0 ? void 0 : userFound.businessName) !== null && _g !== void 0 ? _g : '',
                    isConfirmed: (_h = userFound === null || userFound === void 0 ? void 0 : userFound.isConfirmed) !== null && _h !== void 0 ? _h : false,
                    isDeveloper: (_j = userFound === null || userFound === void 0 ? void 0 : userFound.isDeveloper) !== null && _j !== void 0 ? _j : false,
                    businessAdress: (_k = userFound === null || userFound === void 0 ? void 0 : userFound.businessAdress) !== null && _k !== void 0 ? _k : '',
                    businessZipCode: (_l = userFound === null || userFound === void 0 ? void 0 : userFound.businessZipCode) !== null && _l !== void 0 ? _l : '',
                    businessCity: (_m = userFound === null || userFound === void 0 ? void 0 : userFound.businessCity) !== null && _m !== void 0 ? _m : '',
                    businessCountry: (_o = userFound === null || userFound === void 0 ? void 0 : userFound.businessCountry) !== null && _o !== void 0 ? _o : '',
                    businessDescription: (_p = userFound === null || userFound === void 0 ? void 0 : userFound.businessDescription) !== null && _p !== void 0 ? _p : '',
                    business_logo: (_q = userFound === null || userFound === void 0 ? void 0 : userFound.business_logo.toString('utf-8')) !== null && _q !== void 0 ? _q : '',
                    profil_picture: (_r = userFound === null || userFound === void 0 ? void 0 : userFound.profil_picture.toString('utf-8')) !== null && _r !== void 0 ? _r : '',
                });
            });
            return { status: common_1.HttpStatus.OK, users: userList };
        }
        catch (error) {
            console.error('Error while retrieving users:', error);
            return { status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, users: [null] };
        }
    }
    async createUser(body, req) {
        let isOk = false;
        const userDTO = new users_dto_1.UsersDTO();
        userDTO.email = body.email;
        userDTO.password = await (0, bcryptjs_1.hash)(body.password, 10);
        userDTO.name = body.name;
        userDTO.lastName = body.lastName;
        userDTO.businessRole = body.businessRole;
        userDTO.businessContact = body.businessContact;
        userDTO.businessName = body.businessName;
        userDTO.business_logo = Buffer.from(body.business_logo, 'utf-8');
        userDTO.profil_picture = Buffer.from(body.profil_picture, 'utf-8');
        userDTO.businessDescription = body.businessDescription;
        userDTO.businessLink = body.businessLink;
        userDTO.confirmationToken = (0, uuid_1.v4)();
        if ('isDevelopper' in body) {
            userDTO.isDevelopper = body.isDevelopper;
        }
        else {
            userDTO.isDevelopper = false;
        }
        await (0, class_validator_1.validate)(userDTO).then((errors) => {
            if (errors.length > 0) {
                this.logger.debug(`${errors}`, AuthService_1.name);
            }
            else {
                isOk = true;
            }
        });
        if (isOk) {
            await this.usersRepository.save(userDTO).catch((error) => {
                this.logger.debug(error.message, AuthService_1.name);
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
                }
                else {
                    templateData = {
                        confirmationLink: `${protocol}://${hostname}/confirm?token=${userDTO.confirmationToken}`,
                    };
                }
                await this.mailService.sendMailWithTemplate(userDTO.email, "Confirmation d'inscription", 'confirmationLink', templateData);
                const expiresIn = '64h';
                return {
                    status: common_1.HttpStatus.OK,
                    devMessage: `OK`,
                    userMessage: 'Inscription réussie ! Bienvenue sur notre plateforme. Vous êtes maintenant prêt à explorer notre site.',
                    content: {
                        access_token: this.jwtService.sign({ email: userDTO.email, isDeveloper: false }, { expiresIn }),
                    },
                };
            }
            else {
                return {
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    devMessage: 'A problem occurred with the repository (AuthService:createUser:save)',
                    userMessage: 'Une erreur est survenue lors de la création de votre compte. Veuillez réessayer plus tard.'
                };
            }
        }
        else {
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                devMessage: 'Invalid content (AuthService:createUser:DTO)',
                userMessage: 'Une erreur est survenue lors de la création de l\'user. Veuillez réessayer plus tard.'
            };
        }
    }
    async deleteUserConnected(req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return new Promise(async (resolve) => {
            jwt.verify(token, '123456', async (err, decodedToken) => {
                if (err) {
                    console.error(err);
                    resolve({
                        status: common_1.HttpStatus.FORBIDDEN,
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
                            status: common_1.HttpStatus.NOT_FOUND,
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
                            status: common_1.HttpStatus.FORBIDDEN,
                            devMessage: 'Invalid token (AuthService:deleteUserConnected:delete)',
                            userMessage: 'Vous n\'avez pas les autorisations nécessaires pour supprimer cet user.'
                        });
                        return;
                    }
                    await this.articlesPartnersRepository.delete({ email: decodedToken.email });
                    resolve({
                        status: common_1.HttpStatus.OK,
                        devMessage: 'OK',
                        userMessage: 'Votre compte a été supprimé avec succès.',
                    });
                }
                catch (error) {
                    console.error(error.message);
                    resolve({
                        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        devMessage: 'A problem occurred with the repository (AuthService:deleteUserConnected:delete)',
                        userMessage: 'Une erreur est survenue lors de la création de l\'user. Veuillez réessayer plus tard.'
                    });
                }
            });
        });
    }
    async userAskDev(req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return new Promise(async (resolve) => {
            jwt.verify(token, '123456', async (err, decodedToken) => {
                if (err) {
                    console.error(err);
                    resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token (AuthService:userAskDev:token)' });
                    return;
                }
                try {
                    const userInfo = await this.usersRepository.findOne({
                        where: { email: decodedToken.email },
                    });
                    if (userInfo && userInfo.isDeveloper === true) {
                        resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Already dev permission (AuthService:userAskDev:isDeveloper)' });
                    }
                    else if (userInfo && userInfo.isConfirmed === false) {
                        resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'You need to confirm your account (AuthService:userAskDev:isConfirmed)' });
                    }
                    else {
                        const protocol = req.protocol;
                        const hostname = req.hostname;
                        const originalUrl = req.originalUrl;
                        let templateData;
                        if (process.env.NODE_ENV === 'development') {
                            templateData = {
                                confirmationLink: `${protocol}://${hostname}:3002/confirm_dev?email=${userInfo.email}`,
                            };
                        }
                        else {
                            templateData = {
                                confirmationLink: `${protocol}://${hostname}/confirm_dev?email=${userInfo.email}`,
                            };
                        }
                        await this.mailService.sendMailWithTemplate("localshirt.eip@gmail.com", 'Demande de permission dev de ' + userInfo.email, 'askToBeDevelopper', templateData);
                        resolve({ status: common_1.HttpStatus.OK, devMessage: 'OK' });
                    }
                }
                catch (error) {
                    console.error(error.message);
                    resolve({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (AuthService:userAskDev:sendMailWithTemplate)' });
                    return;
                }
            });
        });
    }
    async giveDevPermission(email) {
        try {
            const user = await this.usersRepository.findOne({ where: { email: email } });
            if (!user) {
                return { status: common_1.HttpStatus.NOT_FOUND, devMessage: 'User not found (AuthService:giveDevPermission:user)' };
            }
            if (user.isDeveloper === true) {
                return { status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Already dev permission (AuthService:giveDevPermission:isDeveloper)' };
            }
            user.isDeveloper = true;
            await this.usersRepository.save(user);
            return { status: common_1.HttpStatus.OK, devMessage: 'OK' };
        }
        catch (error) {
            console.error(error.message);
            return { status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (AuthService:giveDevPermission:save)' };
        }
    }
    async deleteByDeveloper(id, req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return new Promise(async (resolve) => {
            jwt.verify(token, '123456', async (err, decodedToken) => {
                if (err) {
                    console.error(err);
                    resolve({
                        status: common_1.HttpStatus.FORBIDDEN,
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
                            resolve({ status: common_1.HttpStatus.NOT_FOUND, devMessage: 'Id not found (AuthService:deleteByDeveloper:delete)' });
                            return;
                        }
                        resolve({
                            status: common_1.HttpStatus.OK,
                            devMessage: 'OK',
                        });
                    }
                    else {
                        resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token (AuthService:deleteByDeveloper:isDeveloper)' });
                        return;
                    }
                }
                catch (error) {
                    console.error(error.message);
                    resolve({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (AuthService:deleteByDeveloper:catch)' });
                    return;
                }
            });
        });
    }
    async confirmRegistration(token) {
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
            status: common_1.HttpStatus.OK,
            devMessage: 'OK',
            userMessage: 'Votre compte est maintenant confirmé.',
            content: { email: user.email }
        };
    }
    async send_email_password(body, req) {
        const userDetails = await this.usersRepository.findOne({
            where: { email: body.email },
        });
        if (userDetails == null) {
            return { status: common_1.HttpStatus.BAD_REQUEST, msg: { msg: 'Invalid content' } };
        }
        userDetails.resetPassword = true;
        userDetails.resetPasswordReference = (0, uuid_1.v4)();
        const protocol = req.protocol;
        const hostname = req.hostname;
        let templateData;
        if (process.env.NODE_ENV === 'development') {
            templateData = {
                confirmationLink: `${protocol}://${hostname}:3002/password/${userDetails.resetPasswordReference}`,
            };
        }
        else {
            templateData = {
                confirmationLink: `${protocol}://${hostname}/password/${userDetails.resetPasswordReference}`,
            };
        }
        await this.mailService.sendMailWithTemplate(userDetails.email, 'Forget password', 'forgetPassword', templateData);
        await this.usersRepository.save(userDetails);
        return { status: common_1.HttpStatus.OK, content: { msg: `OK` }, devMessage: "OK" };
    }
    async updateConnectedUser(body, req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return new Promise(async (resolve) => {
            jwt.verify(token, '123456', async (err, decodedToken) => {
                if (err) {
                    console.error(err);
                    resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token (AuthService:updateConnectedUser:token)', userMessage: 'Vous n\'avez pas les autorisations nécessaires pour supprimer cet article.' });
                    return;
                }
                try {
                    const userInfo = await this.usersRepository.findOne({
                        where: { email: decodedToken.email },
                    });
                    if (!userInfo) {
                        resolve({ status: common_1.HttpStatus.NOT_FOUND, devMessage: 'Id not found (AuthService:updateConnectedUser:userInfo)', userMessage: 'L\'identifiant spécifié n\'a pas été trouvé.' });
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
                        }
                        else if (body[property] !== 'null') {
                            userInfo[property] = body[property];
                        }
                    });
                    await this.usersRepository.save(userInfo);
                    resolve({
                        status: common_1.HttpStatus.OK,
                        devMessage: 'User updated successfully',
                        userMessage: 'Votre compte a bien été mis à jour.',
                    });
                }
                catch (error) {
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
    async UpdateUserByAdmin(body, req) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        const decodedToken = jwt.verify(token, '123456');
        if (decodedToken && !decodedToken.isDeveloper) {
            return { status: common_1.HttpStatus.FORBIDDEN, devMessage: 'user Forbidden', userMessage: '' };
        }
        return new Promise(async (resolve) => {
            try {
                const userInfo = await this.usersRepository.findOne({
                    where: { email: body.email },
                });
                if (!userInfo) {
                    resolve({ status: common_1.HttpStatus.NOT_FOUND, userMessage: 'utilisateur pas trouvé', devMessage: 'User not found' });
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
                        }
                        else {
                            userInfo[property] = body[property];
                        }
                    }
                });
                await this.usersRepository.save(userInfo);
                resolve({
                    status: common_1.HttpStatus.OK,
                    userMessage: "la mise à jour de l'utilisateur a été effectuée avec succès",
                    devMessage: 'User updated successfully'
                });
            }
            catch (error) {
                console.error(error.message);
                resolve({
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    userMessage: "erreur du serveur",
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
                status: common_1.HttpStatus.FORBIDDEN,
                content: { msg: "Invalid token" },
                devMessage: "invalid token (AuthService:change_password:userDetails)"
            };
        }
        if (userDetails.resetPassword === false) {
            return { status: common_1.HttpStatus.BAD_REQUEST, content: { msg: "Invalid content" }, devMessage: "invalid content (AuthService:change_password:resetPassword)" };
        }
        if (body.password !== body.confirm_password) {
            return { status: common_1.HttpStatus.BAD_REQUEST, content: { msg: "Invalid content" }, devMessage: "invalid content (AuthService:change_password:confirm_password)" };
        }
        userDetails.password = await (0, bcryptjs_1.hash)(body.password, 10);
        userDetails.resetPasswordReference = null;
        userDetails.resetPassword = false;
        await this.usersRepository.save(userDetails);
        return { status: common_1.HttpStatus.OK, content: { msg: `OK` }, devMessage: "OK" };
    }
    async getUser(user) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        const userFound = await this.usersRepository.findOne({
            where: { email: user.email },
        });
        if (!userFound)
            return { status: common_1.HttpStatus.NOT_FOUND, devMessage: 'Id not found (AuthService:getUser:userFound)', user: null };
        return {
            status: common_1.HttpStatus.OK,
            devMessage: `OK`,
            userMessage: `Vos informations ont bien été récupéré.`,
            user: {
                id: userFound.id,
                email: (_a = userFound === null || userFound === void 0 ? void 0 : userFound.email) !== null && _a !== void 0 ? _a : '',
                password: (_b = userFound === null || userFound === void 0 ? void 0 : userFound.password) !== null && _b !== void 0 ? _b : '',
                name: (_c = userFound === null || userFound === void 0 ? void 0 : userFound.name) !== null && _c !== void 0 ? _c : '',
                lastName: (_d = userFound === null || userFound === void 0 ? void 0 : userFound.lastName) !== null && _d !== void 0 ? _d : '',
                businessRole: (_e = userFound === null || userFound === void 0 ? void 0 : userFound.businessRole) !== null && _e !== void 0 ? _e : '',
                businessContact: (_f = userFound === null || userFound === void 0 ? void 0 : userFound.businessContact) !== null && _f !== void 0 ? _f : '',
                businessName: (_g = userFound === null || userFound === void 0 ? void 0 : userFound.businessName) !== null && _g !== void 0 ? _g : '',
                isConfirmed: (_h = userFound === null || userFound === void 0 ? void 0 : userFound.isConfirmed) !== null && _h !== void 0 ? _h : false,
                isDeveloper: (_j = userFound === null || userFound === void 0 ? void 0 : userFound.isDeveloper) !== null && _j !== void 0 ? _j : false,
                businessAdress: (_k = userFound === null || userFound === void 0 ? void 0 : userFound.businessAdress) !== null && _k !== void 0 ? _k : '',
                businessZipCode: (_l = userFound === null || userFound === void 0 ? void 0 : userFound.businessZipCode) !== null && _l !== void 0 ? _l : '',
                businessCity: (_m = userFound === null || userFound === void 0 ? void 0 : userFound.businessCity) !== null && _m !== void 0 ? _m : '',
                businessCountry: (_o = userFound === null || userFound === void 0 ? void 0 : userFound.businessCountry) !== null && _o !== void 0 ? _o : '',
                businessDescription: (_p = userFound === null || userFound === void 0 ? void 0 : userFound.businessDescription) !== null && _p !== void 0 ? _p : '',
                business_logo: (_q = userFound === null || userFound === void 0 ? void 0 : userFound.business_logo.toString('utf-8')) !== null && _q !== void 0 ? _q : '',
                profil_picture: (_r = userFound === null || userFound === void 0 ? void 0 : userFound.profil_picture.toString('utf-8')) !== null && _r !== void 0 ? _r : '',
            },
        };
    }
    async getCompanies() {
        let companies = [];
        let users = await this.usersRepository.find();
        if (!users)
            return { status: common_1.HttpStatus.NOT_FOUND, content: 'Id not found', companies: [] };
        users.map((user) => {
            if (!companies.find(companies => companies.name === user.businessName))
                try {
                    companies.push({ name: user.businessName, logo: user.business_logo.toString('utf-8'), description: user.businessDescription, businessLink: user.businessLink });
                }
                catch (err) {
                    console.error(err);
                }
        });
        return { status: common_1.HttpStatus.OK, content: 'OK', companies: companies };
    }
    async updateEmailById(req, id, newEmail) {
        var _a, _b;
        const jwt = require('jsonwebtoken');
        const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return new Promise(async (resolve) => {
            jwt.verify(token, '123456', async (err, decodedToken) => {
                if (err) {
                    console.error(err);
                    resolve({ status: common_1.HttpStatus.FORBIDDEN, devMessage: 'Invalid token (AuthService:updateEmailById:token)' });
                }
                else {
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
                            resolve({ status: common_1.HttpStatus.NOT_FOUND, devMessage: 'User not found (AuthService:updateEmailById:user)' });
                        }
                        user.email = newEmail;
                        await this.usersRepository.save(user);
                        resolve({ status: common_1.HttpStatus.OK, devMessage: 'OK' });
                    }
                    else {
                        resolve({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (AuthService:updateEmailById:save)' });
                    }
                }
            });
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __param(4, (0, typeorm_1.InjectRepository)(article_partner_entity_1.ArticlePartner)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        jwt_1.JwtService,
        mail_service_1.MailService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map