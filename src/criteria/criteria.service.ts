import {HttpStatus, Injectable} from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { CriteriaDTO } from './dto/criteria.dto';
import { Criteria } from '../database/entities/criteria.entity';
import { Users } from '../database/entities/users.entity';
import {
  AdditionalCriteria,
  CriteriaListResponse,
  CriteriaResponse,
} from './criteria.model';
import {
  computeScore,
  reComputeCriteria,
  ScoreApplication,
} from '../article/computeScore';

@Injectable()
export class CriteriaService {
  constructor(
    private logger: LoggerService,
    @InjectRepository(Criteria)
    private criteriaRepository: Repository<Criteria>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async create(
    body: {
      tag: string;
      type: string;
      additionalCriteria: AdditionalCriteria[];
    },
    req,
  ): Promise<CriteriaResponse> {
    const jwt = require('jsonwebtoken');

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return new Promise<CriteriaResponse>(async (resolve) => {
      const jwt = require('jsonwebtoken');
      const [type, token] = req.headers.authorization?.split(' ') ?? [];
      let decodedToken: { email: string };
      try {
        decodedToken = jwt.verify(token, '123456');
      } catch (err) {
        console.error(err);
        return { status: HttpStatus.FORBIDDEN, devMessage: "Invalid token (CriteriaService:create:decodedToken)", userMessage: "Vous n'avez pas les autorisations nécessaires pour effectuer cette action." };
      }
      jwt.verify(token, '123456', async (err, decodedToken) => {
        if (err) {
          console.error(err);
          return resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token (CriteriaService:create:token)' });
        }

        const userInfo = await this.userRepository.findOne({
          where: { email: decodedToken.email },
        });

        if (userInfo && userInfo.isDeveloper === true) {
          const criteriaDTO = new CriteriaDTO();
          criteriaDTO.tag = body.tag;
          criteriaDTO.type = body.type;
          criteriaDTO.additionalCriteria = JSON.stringify(
            body.additionalCriteria,
          );

          const errors = await validate(criteriaDTO);

          if (errors.length > 0) {
            console.error(errors);
            return resolve({ status: HttpStatus.BAD_REQUEST, devMessage: 'Invalid content (CriteriaService:create:DTO)' });
          }
          let needRecomputeCriteria: boolean = false;
          const criteria = new Criteria();
          criteria.tag = criteriaDTO.tag;
          criteria.type = criteriaDTO.type;
          criteria.additionalCriteria = criteriaDTO.additionalCriteria;
          let score = await computeScore(
            criteria,
            ScoreApplication.ECOLOGICAL,
            this.criteriaRepository,
          );
          criteria.ecological_score = score.score;
          needRecomputeCriteria =
            score.needToRecomputeOther || needRecomputeCriteria;
          score = await computeScore(
            criteria,
            ScoreApplication.ETHICAL,
            this.criteriaRepository,
          );
          criteria.ethical_score = score.score;
          needRecomputeCriteria =
            score.needToRecomputeOther || needRecomputeCriteria;
          criteria.local_score = Math.floor(
            (criteria.ecological_score + criteria.ethical_score) / 2,
          );

          try {
            await this.criteriaRepository.save(criteria);
            if (needRecomputeCriteria)
              await reComputeCriteria(this.criteriaRepository);
            return resolve({
              status: HttpStatus.OK,
              devMessage: 'OK',
            });
          } catch (error) {
            console.error(error.message);
            return resolve({ status: HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (CriteriaService:create:save)' });
          }
        } else {
          return resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token (CriteriaService:create:isDeveloper)' });
        }
      });
    });
  }

  async delete(id: string, req: any): Promise<CriteriaResponse> {
    const jwt = require('jsonwebtoken');

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return new Promise<CriteriaResponse>((resolve, reject) => {
      jwt.verify(token, '123456', async (err, decodedToken) => {
        if (err) {
          console.error(err);
          return resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token (CriteriaService:delete:token)' });
        }

        const userInfo = await this.userRepository.findOne({
          where: { email: decodedToken.email },
        });

        if (userInfo && userInfo.isDeveloper === true) {
          try {
            const deleteResult = await this.criteriaRepository.delete(id);
            if (deleteResult.affected === 0) {
              resolve({ status: HttpStatus.NOT_FOUND, devMessage: 'Id not found (CriteriaService:delete:delete)' });
            } else {
              resolve({
                status: HttpStatus.OK,
                devMessage: 'OK',
              });
            }
          } catch (error) {
            console.error(error);
            resolve({ status: HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (CriteriaService:delete:catch)' });
          }
        } else {
          resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token (CriteriaService:delete:isDeveloper)' });
        }
      });
    });
  }

  async update(id: string, body: any, req: any): Promise<CriteriaResponse> {
    const jwt = require('jsonwebtoken');

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return new Promise<CriteriaResponse>(async (resolve) => {
      jwt.verify(token, '123456', async (err, decodedToken) => {
        if (err) {
          console.error(err);
          return resolve({ status: HttpStatus.BAD_REQUEST, devMessage: 'Invalid token (CriteriaService:update:token)' });
        }

        const userInfo = await this.userRepository.findOne({
          where: { email: decodedToken.email },
        });

        if (userInfo && userInfo.isDeveloper === true) {
          const criteriaDTO = new CriteriaDTO();
          criteriaDTO.tag = body.tag;
          criteriaDTO.type = body.type;

          const errors = await validate(criteriaDTO);

          if (errors.length > 0) {
            console.error(errors);
            return resolve({ status: HttpStatus.BAD_REQUEST, devMessage: 'Invalid content (CriteriaService:update:DTO)' });
          }

          try {
            const criteria = await this.criteriaRepository.findOne({
              where: {
                id: id,
              },
            });

            if (!criteria) {
              return resolve({ status: HttpStatus.NOT_FOUND, devMessage: 'Id not found (CriteriaService:criteria)' });
            }

            criteria.tag = body.tag;
            criteria.type = body.type;

            await this.criteriaRepository.save(criteria);

            return resolve({
              status: HttpStatus.OK,
              devMessage: 'OK',
            });
          } catch (error) {
            console.error(error);
            return resolve({ status: HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (CriteriaService:update:save)' });
          }
        } else {
          return resolve({ status: HttpStatus.FORBIDDEN, devMessage: 'Invalid token (CriteriaService:update:catch)' });
        }
      });
    });
  }

  async getAllCriteria(): Promise<CriteriaListResponse> {
    const criteriaList = await this.criteriaRepository.find();

    if (!criteriaList)
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, devMessage: 'A problem occurred with the repository (CriteriaService:getAllCriteria:find)', criteria: [] };
    return {
      status: HttpStatus.OK,
      devMessage: 'OK',
      criteria: criteriaList,
    };
  }
}
