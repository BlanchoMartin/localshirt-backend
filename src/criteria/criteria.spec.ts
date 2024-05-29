import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { instance, mock } from 'ts-mockito';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { SelectQueryBuilder } from 'typeorm';
import { compareSync, hash } from 'bcryptjs';

import { LoggerService } from '../logger/logger.service';
import { Users } from '../database/entities/users.entity';
import { Criteria } from '../database/entities/criteria.entity';
import { CriteriaService } from './criteria.service';
import {Question} from "../question/question.model";
import {CriteriaResolver} from "./criteria.resolver";
import {HttpStatus} from "@nestjs/common";

describe('CriteriaService', () => {
  let serviceCriteria: CriteriaService;
  let repositoryUser: Repository<Users>;
  let repositoryCriteria: Repository<Criteria>;
  let repositoryQuestion: Repository<Question>;

  let repositoryTokenUsers: string | Function = getRepositoryToken(Users);
  let repositoryTokenCriteria: string | Function = getRepositoryToken(Criteria);
  let repositoryTokenQuestion: string | Function = getRepositoryToken(Question);

  let resolver: CriteriaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        JwtService,
        CriteriaService,
        {
          provide: getRepositoryToken(Users),
          useValue: instance(mock(Repository)),
        },
        {
          provide: getRepositoryToken(Criteria),
          useValue: instance(mock(Repository)),
        },
        {
          provide: getRepositoryToken(Question),
          useValue: instance(mock(Repository)),
        },
      ],
    }).compile();

    serviceCriteria = module.get<CriteriaService>(CriteriaService);
    repositoryUser = module.get(repositoryTokenUsers);
    repositoryCriteria = module.get(repositoryTokenCriteria);
    repositoryQuestion = module.get(repositoryTokenQuestion);
    resolver = new CriteriaResolver(serviceCriteria);
  }, 60000);

  it('should be defined', () => {
    expect(serviceCriteria).toBeDefined();
  });

  it('successfully create criteria', async () => {
    const newUser = {
      id: 'a',
      email: "qcpoubelle@gmail.com",
      password: await hash("localshirt", 10),
      name: "Quentin",
      lastName: "Caniou",
      businessName: "Localshirt",
      businessRole: "president",
      businessContact: "0000000000",
      isConfirmed: true,
      isDeveloper: true,
      confirmationToken: uuidv4(),
      resetPassword: false,
      resetPasswordReference: ""
    } as Users;

    const secretKey = '123456';
    const userPayload = { email: 'martinblancho3@gmail.com' };
    const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    jest.spyOn(repositoryUser, 'findOne').mockResolvedValue({
      id: 'a',
      image: Buffer.from("", 'utf-8'),
      name: "Quentin",
      email: "qcpoubelle@gmail.com",
      businessContact: "",
      businessName: "",
      businessRole: "",
      lastName: "Caniou",
      password: "localshirt",
      isDeveloper: true,
      confirmationToken: "",
      resetPasswordReference: "",
      isConfirmed: true,
      resetPassword: false,
      businessAdress: "",
      businessCity: "",
      businessCountry: "",
      businessDescription: "",
      businessZipCode: ""
    });

    const result = await resolver.createCriteria(
        "production",
        "material",
        [
      {
        result: "true",
        question: {
          questionId: 'a',
          criteria_application: "ecological",
          user_response_type: "boolean",
          factor: 1,
          minimize: true
        }
      }
    ], {req: req});

    expect(result).toEqual({
      status: HttpStatus.OK ,
      content: 'OK',
    });
  });

  it('could not create criteria, not authorized', async () => {
    const newUser = {
      id: 'a',
      email: "qcpoubelle@gmail.com",
      password: await hash("localshirt", 10),
      name: "Quentin",
      lastName: "Caniou",
      businessName: "Localshirt",
      businessRole: "president",
      businessContact: "0000000000",
      isConfirmed: true,
      isDeveloper: true,
      confirmationToken: uuidv4(),
      resetPassword: false,
      resetPasswordReference: ""
    } as Users;

    const secretKey = '123456';
    const userPayload = { email: 'martinblancho3@gmail.com' };
    const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    jest.spyOn(repositoryUser, 'findOne').mockResolvedValue({
      id: 'a',
      image: Buffer.from("", 'utf-8'),
      name: "Quentin",
      email: "qcpoubelle@gmail.com",
      businessContact: "",
      businessName: "",
      businessRole: "",
      lastName: "Caniou",
      password: "localshirt",
      isDeveloper: false,
      confirmationToken: "",
      resetPasswordReference: "",
      isConfirmed: true,
      resetPassword: false,
      businessAdress: "",
      businessCity: "",
      businessCountry: "",
      businessDescription: "",
      businessZipCode: ""
    });

    const result = await resolver.createCriteria(
        "production",
        "material",
        [
      {
        result: "true",
        question: {
          questionId: 'a',
          criteria_application: "ecological",
          user_response_type: "boolean",
          factor: 1,
          minimize: true
        }
      }
    ], {req: req});

    expect(result).toEqual({
      status: HttpStatus.FORBIDDEN,
      content: 'Invalid token',
    });
  });

  it('could not create criteria, not good key', async () => {
    const newUser = {
      id: 'a',
      email: "qcpoubelle@gmail.com",
      password: await hash("localshirt", 10),
      name: "Quentin",
      lastName: "Caniou",
      businessName: "Localshirt",
      businessRole: "president",
      businessContact: "0000000000",
      isConfirmed: true,
      isDeveloper: true,
      confirmationToken: uuidv4(),
      resetPassword: false,
      resetPasswordReference: ""
    } as Users;

    const secretKey = '12';
    const userPayload = { email: 'martinblancho3@gmail.com' };
    const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    jest.spyOn(repositoryUser, 'findOne').mockResolvedValue({
      id: 'a',
      image: Buffer.from("", 'utf-8'),
      name: "Quentin",
      email: "qcpoubelle@gmail.com",
      businessContact: "",
      businessName: "",
      businessRole: "",
      lastName: "Caniou",
      password: "localshirt",
      isDeveloper: false,
      confirmationToken: "",
      resetPasswordReference: "",
      isConfirmed: true,
      resetPassword: false,
      businessAdress: "",
      businessCity: "",
      businessCountry: "",
      businessDescription: "",
      businessZipCode: ""
    });

    const result = await resolver.createCriteria(
        "production",
        "material",
        [
      {
        result: "true",
        question: {
          questionId: 'a',
          criteria_application: "ecological",
          user_response_type: "boolean",
          factor: 1,
          minimize: true
        }
      }
    ], {req: req}
    );

    expect(result).toEqual({
      status: HttpStatus.FORBIDDEN,
      content: 'Invalid token',
    });
  });

  it('successfully get all criteria', async () => {
    jest.spyOn(repositoryCriteria, 'find').mockResolvedValue([{
      id: 'a',
      type: 'material',
      tag: 'production',
      local_score: 0,
      ethical_score: 0,
      ecological_score: 0,
      additionalCriteria: ''
    }]);

    const result = await resolver.getAllCriteria({req: null});

    expect(result).toEqual({content: "OK", criteria: [{
        id: 'a',
        type: 'material',
        tag: 'production',
        local_score: 0,
        ethical_score: 0,
        ecological_score: 0,
        additionalCriteria: ""
      }], status: 200});
  });

  it('unsuccessfully get all criteria', async () => {
    const result = await resolver.getAllCriteria({req: null});

    expect(result).toEqual({ status: HttpStatus.INTERNAL_SERVER_ERROR, content: 'A problem occurred with the repository', criteria: [] });
  });
});
