import {HttpStatus, Injectable} from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { QuestionDTO } from './dto/question.dto';
import { Question } from '../database/entities/question.entity';
import jwt from 'jsonwebtoken';
import { Users } from '../database/entities/users.entity';
import { CriteriaDTO } from '../criteria/dto/criteria.dto';
import { ArticleWeb } from '../database/entities/article.web.entity';
import {QuestionResponse} from "./question.model";

@Injectable()
export class QuestionService {
  constructor(
    private logger: LoggerService,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async create(
    body: {
      tag: string;
      content: string;
      criteria_target: string;
      criteria_application: string;
      user_response_type: string;
      factor: number;
      minimize: boolean;
    },
    req,
  ): Promise<Record<string, any>> {
    let isOk = false;


    const jwt = require('jsonwebtoken');

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return await new Promise<QuestionResponse>(async (resolve) => {
      jwt.verify(token, '123456', async (err, decodedToken) => {
        if (err) {
          console.error(err);
          return resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token (QuestionService:create:token)' });
        }const user = await this.usersRepository.findOne({
          where: { email: decodedToken.email },
        });
        if (!user || !user.isDeveloper) {
          console.error(err);
          return resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token (QuestionService:create:isDeveloper)' });
        }
        const questionDTO = new QuestionDTO();
        questionDTO.tag = body.tag;
        questionDTO.content = body.content;
        questionDTO.criteria_target = body.criteria_target;
        questionDTO.criteria_application = body.criteria_application;
        questionDTO.user_response_type = body.user_response_type;
        questionDTO.factor = body.factor;
        questionDTO.minimize = body.minimize;

        await validate(questionDTO).then((errors) => {
          if (errors.length > 0) {
            this.logger.debug(`${errors}`, QuestionService.name);
          } else {
            isOk = true;
          }
        });
        if (isOk) {
          const question = new Question();
          question.tag = questionDTO.tag;
          question.content = questionDTO.content;
          question.criteria_target = questionDTO.criteria_target;
          question.criteria_application = questionDTO.criteria_application;
          question.user_response_type = questionDTO.user_response_type;
          question.factor = questionDTO.factor;
          question.minimize = questionDTO.minimize;
          try {
            await this.questionRepository.save(question);
          } catch (err) {
            this.logger.debug(err.message, QuestionService.name);
            isOk = false;
          }
          if (isOk) {
            return resolve({
              status: HttpStatus.OK,
              devMessage: 'OK',
            });
          } else {
            return resolve({ status: HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (QuestionService:create:save)' });
          }
        } else {
          return resolve({ status: HttpStatus.BAD_REQUEST, devMessage: 'Invalid content (QuestionService:create:DTO)' });
        }
      });
    });
  }

  async updateById(
    body: {
      id: string;
      tag: string;
      content: string;
      criteria_target: string;
      criteria_application: string;
      user_response_type: string;
      factor: number;
      minimize: boolean;
    },
    req,
  ): Promise<Record<string, any>> {
    const jwt = require('jsonwebtoken');

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return new Promise<QuestionResponse>(async (resolve) => {
      jwt.verify(token, '123456', async (err, decodedToken) => {
        const user = await this.usersRepository.findOne({
          where: { email: decodedToken.email },
        });
        if (err || !user || !user.isDeveloper) {
          console.error(err);
          return resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token (QuestionService:updateById:isDeveloper)' });
        }

        try {
          const QuestionInfo: Question = await this.questionRepository.findOne({
            where: { id: body.id },
          });
          if (!QuestionInfo) {
            return resolve({ status: HttpStatus.NOT_FOUND, devMessage: 'Id not found (QuestionService:updateById:QuestionInfo)' });
          }

          const propertiesToUpdate = [
            'tag',
            'content',
            'criteria_target',
            'criteria_application',
            'user_response_type',
            'factor',
            'extremum',
            'minimize',
          ];

          propertiesToUpdate.forEach((property) => {
            if (body[property] !== null) {
              QuestionInfo[property] = body[property];
            }
          });

          await this.questionRepository.save(QuestionInfo);

          return resolve({ status: HttpStatus.OK, devMessage: 'OK' });
        } catch (error) {
          console.error(error.message);
          return resolve({ status: HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (QuestionService:updateById:save)' });
        }
      });
    });
  }

  async updateByTag(
      body: {
        tag: string;
        content: string;
        criteria_target: string;
        criteria_application: string;
        user_response_type: string;
        factor: number;
        minimize: boolean;
      },
      req,
  ): Promise<Record<string, any>> {
    const jwt = require('jsonwebtoken');

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return new Promise<QuestionResponse>(async (resolve) => {
      jwt.verify(token, '123456', async (err, decodedToken) => {
        const user = await this.usersRepository.findOne({
          where: { email: decodedToken.email },
        });
        if (err || !user || !user.isDeveloper) {
          console.error(err);
          return resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token' });
        }

        try {
          const QuestionInfo: Question = await this.questionRepository.findOne({
            where: { tag: body.tag },
          });
          if (!QuestionInfo) {
            return this.create(body, req);
          }

          const propertiesToUpdate = [
            'content',
            'criteria_target',
            'criteria_application',
            'user_response_type',
            'factor',
            'extremum',
            'minimize',
          ];

          propertiesToUpdate.forEach((property) => {
            if (body[property] !== null) {
              QuestionInfo[property] = body[property];
            }
          });

          await this.questionRepository.save(QuestionInfo);

          return resolve({ status: HttpStatus.OK, devMessage: 'OK' });
        } catch (error) {
          console.error(error.message);
          return resolve({ status: HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (QuestionService:updateByTag:save)' });
        }
      });
    });
  }

  async deleteById(id: string, req): Promise<Record<string, any>> {
    const jwt = require('jsonwebtoken');

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return new Promise<QuestionResponse>(async (resolve) => {
      jwt.verify(token, '123456', async (err, decodedToken) => {
        const user = await this.usersRepository.findOne({
          where: { email: decodedToken.email },
        });
        if (err || !user || !user.isDeveloper) {
          console.error(err);
          return resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token (QuestionService:deleteById:token)' });
        }

        try {
          await this.questionRepository.delete(id);

          return resolve({ status: HttpStatus.OK, devMessage: 'OK' });
        } catch (error) {
          console.error(error.message);
          return resolve({ status: HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (QuestionService:deleteById:delete)' });
        }
      });
    });
  }

  async getByTag(tag: string, req) {
    const jwt = require('jsonwebtoken');

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return new Promise<QuestionResponse>(async (resolve) => {
      jwt.verify(token, '123456', async (err, decodedToken) => {
        const user = await this.usersRepository.findOne({
          where: { email: decodedToken.email },
        });
        if (err || !user || !user.isDeveloper) {
          console.error(err);
          return resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token (QuestionService:getByTag:isDeveloper)' });
        }

        try {
          const elem = await this.questionRepository.findOne({ where: { tag: tag } });
          if (!elem)
            return resolve({
              status: HttpStatus.NOT_FOUND,
              devMessage: `Id not found`,
            });
          return resolve({
            status: HttpStatus.OK,
            devMessage: JSON.stringify(elem),
          });
        } catch (error) {
          console.error(error.message);
          return resolve({ status: HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (QuestionService:getByTag:elem)' });
        }
      });
    });
  }

  async getAll(req): Promise<Question[]> {
    const jwt = require('jsonwebtoken');

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return new Promise<Question[]>(async (resolve) => {
      jwt.verify(token, '123456', async (err, decodedToken) => {
        if (err) {
          console.error(err);
          return resolve([]);
        }

        const user = await this.usersRepository.findOne({
          where: { email: decodedToken.email },
        });

        if (!user || !user.isConfirmed) {
          console.error(err);
          return resolve([]);
        }

        try {
          return resolve(await this.questionRepository.find());
        } catch (error) {
          console.error(error.message);
          return resolve([]);
        }
      });
    });
  }
}