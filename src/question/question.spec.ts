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
import {Question} from "../question/question.model";
import {QuestionService} from "./question.service";
import {QuestionResolver} from "./question.resolver";
import {Args, Context} from "@nestjs/graphql";
import {HttpStatus} from "@nestjs/common";

describe('CriteriaService', () => {
    let serviceQuestion: QuestionService;
    let repositoryUser: Repository<Users>;
    let repositoryQuestion: Repository<Question>;

    let repositoryTokenUsers: string | Function = getRepositoryToken(Users);
    let repositoryTokenQuestion: string | Function = getRepositoryToken(Question);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoggerService,
                JwtService,
                QuestionService,
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

        serviceQuestion = module.get<QuestionService>(QuestionService);
        repositoryUser = module.get(repositoryTokenUsers);
        repositoryQuestion = module.get(repositoryTokenQuestion);
    }, 60000);

    it('should be defined', () => {
        expect(serviceQuestion).toBeDefined();
    });

    it('successfully create question', async () => {
        const secretKey = '123456';
        const userPayload = { email: 'qcpoubelle@gmail.com' };
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

        const result = await serviceQuestion.create({
                tag: "production",
                content: "Is the production ecological ?",
                criteria_target: "material",
                criteria_application: "ecological",
                user_response_type: "boolean",
                factor: 1,
                minimize: true
            },
            req,
        );

        expect(result).toEqual({
            status: HttpStatus.OK,
            content: 'OK',
        });
    });

    it('could not create question, not developer', async () => {
        const secretKey = '123456';
        const userPayload = { email: 'qcpoubelle@gmail.com' };
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

        const result = await serviceQuestion.create({
                tag: "production",
                content: "Is the production ecological ?",
                criteria_target: "material",
                criteria_application: "ecological",
                user_response_type: "boolean",
                factor: 1,
                minimize: true
            },
            req,
        );

        expect(result).toEqual({ status: HttpStatus.FORBIDDEN, content: 'Invalid token' });
    });

    it('successfully delete question', async () => {
        const secretKey = '123456';
        const userPayload = { email: 'qcpoubelle@gmail.com' };
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

        jest.spyOn(repositoryQuestion, 'findOne').mockResolvedValue({
            tag: "production",
            content: "Is the production ecological ?",
            criteria_target: "material",
            criteria_application: "ecological",
            user_response_type: "boolean",
            factor: 1,
            minimize: true,
            id: 'a'
        });

        const result = await serviceQuestion.deleteById('a', req);

        expect(result).toEqual({ status: HttpStatus.OK, content: 'OK' });
    });

    it('could not delete question, not developer', async () => {
        const secretKey = '123456';
        const userPayload = { email: 'qcpoubelle@gmail.com' };
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

        const result = await serviceQuestion.deleteById('a', req);

        expect(result).toEqual({ status: HttpStatus.FORBIDDEN, content: 'Invalid token' });
    });

    it('successfully get question', async () => {
        const secretKey = '123456';
        const userPayload = { email: 'qcpoubelle@gmail.com' };
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

        jest.spyOn(repositoryQuestion, 'findOne').mockResolvedValue({
            tag: "production",
            content: "Is the production ecological ?",
            criteria_target: "material",
            criteria_application: "ecological",
            user_response_type: "boolean",
            factor: 1,
            minimize: true,
            id: 'a'
        });

        const result = await serviceQuestion.getByTag('production', req);

        expect(result).toEqual({
            status: HttpStatus.OK,
            content: JSON.stringify({
                tag: "production",
                content: "Is the production ecological ?",
                criteria_target: "material",
                criteria_application: "ecological",
                user_response_type: "boolean",
                factor: 1,
                minimize: true,
                id: 'a'
            }),
        });
    });

    it('could not get question, not developer', async () => {
        const secretKey = '123456';
        const userPayload = { email: 'qcpoubelle@gmail.com' };
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

        const result = await serviceQuestion.getByTag('production', req);

        expect(result).toEqual({
            status: HttpStatus.FORBIDDEN,
            content: 'Invalid token',
        });
    });
});
