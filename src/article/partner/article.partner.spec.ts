import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { instance, mock } from 'ts-mockito';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import { SelectQueryBuilder } from 'typeorm';
import {compareSync, hash} from 'bcryptjs';

import { ArticlePartnerService } from './article.partner.service';
import { AuthService } from './../../auth/auth.service';
import { LoggerService } from './../../logger/logger.service';
import { ArticlePartner } from './../../database/entities/article.partner.entity';
import { Users } from './../../database/entities/users.entity';
import { Criteria } from './../../database/entities/criteria.entity';
import {HttpStatus} from "@nestjs/common";

describe('ArticlePartnerService', () => {
  let serviceArticlePartner: ArticlePartnerService;
  let articleRepository: Repository<ArticlePartner>;
  let usersRepository: Repository<Users>;
  let criteriasRepository: Repository<Criteria>;

  let repositoryTokenArticlePartner: string | Function = getRepositoryToken(ArticlePartner);
  let repositoryTokenUsers: string | Function = getRepositoryToken(Users);
  let repositoryTokenCriteria: string | Function = getRepositoryToken(Criteria);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        JwtService,
        ArticlePartnerService,
        {
          provide: getRepositoryToken(ArticlePartner),
          useValue: instance(mock(Repository)),
        },
        {
          provide: getRepositoryToken(Users),
          useValue: instance(mock(Repository)),
        },
        {
          provide: getRepositoryToken(Criteria),
          useValue: instance(mock(Repository)),
        },
      ],
    }).compile();

    serviceArticlePartner = module.get<ArticlePartnerService>(ArticlePartnerService);
    articleRepository = module.get(repositoryTokenArticlePartner);
    usersRepository = module.get(repositoryTokenUsers);
    criteriasRepository = module.get(repositoryTokenCriteria);
  }, 60000);

  it('should be defined', () => {
    expect(serviceArticlePartner).toBeDefined();
  });

  it('sucessfully create article', async () => {

    const newUser = {
      id: 'a',
      email: "martinblancho3@gmail.com",
      password: await hash("localshirt2001", 10),
      name: "Pascal",
      lastName: "Prout",
      businessName: "Le Slip Français",
      businessRole: "Manager",
      businessContact: "0607884567",
      isConfirmed: true,
      isDeveloper: true,
      confirmationToken: uuidv4(),
      resetPassword: false,
      resetPasswordReference: "",
      image: Buffer.from("", 'utf-8'),
      businessAdress: '',
      businessCity: '',
      businessCountry: '',
      businessDescription: '',
      businessZipCode: ''
    } as Users;

    const body = {
      id: 'a',
      name:"casquette",
      brand:"cochonou",
      country: [{name: "france"}],
      transport: [{name: "plane"}],
      material: [{name: "blabla"}],
      price: "",
      image: "",
      brandlogo: "",
      branddesc: "",
      environnementdesc: "",
      ethicaldesc: "",
      description: "",
      additionalCriteria: [
        {
          result: "true",
          question: 
          {
            criteria_application: "ecological",
            user_response_type: "boolean",
            factor: 1,
            minimize: true,
          }
        },
        {
          result: "30",
          question: 
          {
            criteria_application: "ethical",
            user_response_type: "range",
            factor: 2,
            minimize: true,
          }
        }
      ]
    };
    const secretKey = '123456';
    const userPayload = { email: 'martinblancho3@gmail.com' };
    
    const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
    
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const result = await serviceArticlePartner.create(body, req);

    expect(result).toEqual({
      status: HttpStatus.OK,
      content: 'OK',
    });
  });

  it('should delete an ArticlePartner successfully', async () => {
    const id = '1';
    const secretKey = '123456';
    const userPayload = { email: 'martinblancho3@gmail.com' };
    
    const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
    
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const body = {
      id: 'a',
      name:"casquette",
      email: "martinblancho3@gmail.com",
      brand:"cochonou",
      country: "france",
      ethical_score: 20,
      ecological_score: 20,
      local_score: 20,
      rgb: [20, 34,!56],
      transport: "plane",
      material: "blabla",
      price: 0,
      image: Buffer.from("", 'utf-8'),
      brandlogo: Buffer.from("", 'utf-8'),
      branddesc: "",
      environnementdesc: "",
      ethicaldesc: "",
      description: "",
      additionalCriteria: [
        {
          result: "true",
          question: 
          {
            criteria_application: "ecological",
            user_response_type: "boolean",
            factor: 1,
            minimize: true,
          }
        },
        {
          result: "30",
          question: 
          {
            criteria_application: "ethical",
            user_response_type: "range",
            factor: 2,
            minimize: true,
          }
        }
      ]
    } as ArticlePartner;

    jest.spyOn(articleRepository, 'find').mockResolvedValue([body]);

    const result = await serviceArticlePartner.delete(id, req);

    expect(result).toEqual({ status: HttpStatus.OK, content: 'OK' });
  });

  it('ArticlePartner not found for delete', async () => {
    const id = 'a';
    const secretKey = '123456';
    const userPayload = { email: 'martinblancho3@gmail.com' };
    const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const body = {
      id: 'a',
      name:"casquette",
      email: "martinblancho@gmail.com",
      brand:"cochonou",
      country: "france",
      ethical_score: 20,
      ecological_score: 20,
      local_score: 20,
      rgb: [20, 34,!56],
      transport: "plane",
      material: "blabla",
      price: 0,
      image: Buffer.from("", 'utf-8'),
      brandlogo: Buffer.from("", 'utf-8'),
      branddesc: "",
      environnementdesc: "",
      ethicaldesc: "",
      description: "",
      additionalCriteria: [
        {
          result: "true",
          question: 
          {
            criteria_application: "ecological",
            user_response_type: "boolean",
            factor: 1,
            minimize: true,
          }
        },
        {
          result: "30",
          question: 
          {
            criteria_application: "ethical",
            user_response_type: "range",
            factor: 2,
            minimize: true,
          }
        }
      ]
    } as ArticlePartner;

    jest.spyOn(articleRepository, 'find').mockResolvedValue([body]);

    const result = await serviceArticlePartner.delete(id, req);
    expect(result).toEqual({ status: HttpStatus.NOT_FOUND, content: 'Id not found' });
  });

  it('Cannot delete an ArticlePartner successfully no authorization', async () => {
    const id = 'a';
    const secretKey = '123456';
    const userPayload = { email: 'martinblancho3@gmail.com' };
    const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
    
    const req = {
      headers: {
        authorization: `Bearer`,
      },
    };

    const body = {
      id: 'a',
      name:"casquette",
      email: "mart@gmail.com",
      brand:"cochonou",
      country: "france",
      ethical_score: 20,
      ecological_score: 20,
      local_score: 20,
      rgb: [20, 34,!56],
      transport: "plane",
      material: "blabla",
      price: 0,
      image: Buffer.from("", 'utf-8'),
      brandlogo: Buffer.from("", 'utf-8'),
      branddesc: "",
      environnementdesc: "",
      ethicaldesc: "",
      description: "",
      additionalCriteria: [
        {
          result: "true",
          question: 
          {
            criteria_application: "ecological",
            user_response_type: "boolean",
            factor: 1,
            minimize: true,
          }
        },
        {
          result: "30",
          question: 
          {
            criteria_application: "ethical",
            user_response_type: "range",
            factor: 2,
            minimize: true,
          }
        }
      ]
    } as ArticlePartner;

    jest.spyOn(articleRepository, 'find').mockResolvedValue([body]);

    const result = await serviceArticlePartner.delete(id, req);
    expect(result).toEqual({ status: HttpStatus.FORBIDDEN, content: 'Invalid token' });
  });

  it('should update an ArticlePartner successfully', async () => {
    const id = 'a';
    const secretKey = '123456';
    const userPayload = { email: 'martinblancho3@gmail.com' };
    const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const body = {
      id: 'a',
      name:"casquette",
      email: "martinblancho3@gmail.com",
      brand:"cochonou",
      country: "france",
      ethical_score: 20,
      ecological_score: 20,
      local_score: 20,
      rgb: [20, 34,!56],
      transport: "plane",
      material: "blabla",
      price: 0,
      image: Buffer.from("", 'utf-8'),
      brandlogo: Buffer.from("", 'utf-8'),
      branddesc: "",
      environnementdesc: "",
      ethicaldesc: "",
      description: "",
      additionalCriteria: [
        {
          result: "true",
          question: 
          {
            criteria_application: "ecological",
            user_response_type: "boolean",
            factor: 1,
            minimize: true,
          }
        },
        {
          result: "30",
          question: 
          {
            criteria_application: "ethical",
            user_response_type: "range",
            factor: 2,
            minimize: true,
          }
        }
      ]
    } as ArticlePartner;

    jest.spyOn(articleRepository, 'findOne').mockResolvedValueOnce({
      id: 'a',
      email: "martinblancho3@gmail.com",
      name: "Pascal",
      brand: "Prout",
      country: "france",
      material: "bois",
      transport: "plane",
      branddesc: "un t-shirt noir bon pour l'environnement",
      image: Buffer.from("https://mpdemo.cs-cart.jp/images/detailed/1/t-7.jpg", 'utf-8'),
      brandlogo: Buffer.from("https://planetgrimpe.com/wp-content/uploads/2018/08/logo-1024x369.png", 'utf-8'),
      price: 90.99,
      ethicaldesc: "Lorem ipsum ethical description",
      environnementdesc: "Lorem ipsum environmental description",
      ecological_score: 30,
      local_score: 30,
      ethical_score: 20,
      description: "",
      rgb: [30, 233, 12],
    });

    const result = await serviceArticlePartner.update(id, body, req);
    expect(result).toEqual({ status: HttpStatus.OK, content: 'OK' });
  });

  it('should update an ArticlePartner not authorized', async () => {
    const id = 'a';
    const secretKey = '123456';
    const userPayload = { email: 'martinblancho@gmail.com' };
    const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const body = {
      id: 'a',
      name:"casquette",
      email: "martinblanc@gmail.com",
      brand:"cochonou",
      country: "france",
      ethical_score: 20,
      ecological_score: 20,
      local_score: 20,
      rgb: [20, 34,!56],
      transport: "plane",
      material: "blabla",
      price: 0,
      image: Buffer.from("", 'utf-8'),
      brandlogo: Buffer.from("", 'utf-8'),
      branddesc: "",
      environnementdesc: "",
      ethicaldesc: "",
      description: "",
      additionalCriteria: [
        {
          result: "true",
          question: 
          {
            criteria_application: "ecological",
            user_response_type: "boolean",
            factor: 1,
            minimize: true,
          }
        },
        {
          result: "30",
          question: 
          {
            criteria_application: "ethical",
            user_response_type: "range",
            factor: 2,
            minimize: true,
          }
        }
      ]
    } as ArticlePartner;

    jest.spyOn(articleRepository, 'findOne').mockResolvedValueOnce({
      id: 'a',
      email: "martinblancho3@gmail.com",
      name: "Pascal",
      brand: "Prout",
      country: "france",
      material: "bois",
      transport: "plane",
      branddesc: "un t-shirt noir bon pour l'environnement",
      image: Buffer.from("https://mpdemo.cs-cart.jp/images/detailed/1/t-7.jpg", 'utf-8'),
      brandlogo: Buffer.from("https://planetgrimpe.com/wp-content/uploads/2018/08/logo-1024x369.png", 'utf-8'),
      price: 90.99,
      ethicaldesc: "Lorem ipsum ethical description",
      environnementdesc: "Lorem ipsum environmental description",
      ecological_score: 30,
      local_score: 30,
      ethical_score: 20,
      description: "",
      rgb: [30, 233, 12],
    });

    const result = await serviceArticlePartner.update(id, body, req);
    expect(result).toEqual({ status: HttpStatus.FORBIDDEN, content: 'Invalid token' });
  });

  it('should update an ArticlePartner not found', async () => {
    const id = 'a';
    const secretKey = '123456';
    const userPayload = { email: 'martinblancho@gmail.com' };
    const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const body = {
      id: 'a',
      name:"casquette",
      email: "martinblanc@gmail.com",
      brand:"cochonou",
      country: "france",
      ethical_score: 20,
      ecological_score: 20,
      local_score: 20,
      rgb: [20, 34,!56],
      transport: "plane",
      material: "blabla",
      price: 0,
      image: Buffer.from("", 'utf-8'),
      brandlogo: Buffer.from("", 'utf-8'),
      branddesc: "",
      environnementdesc: "",
      ethicaldesc: "",
      description: "",
      additionalCriteria: [
        {
          result: "true",
          question: 
          {
            criteria_application: "ecological",
            user_response_type: "boolean",
            factor: 1,
            minimize: true,
          }
        },
        {
          result: "30",
          question: 
          {
            criteria_application: "ethical",
            user_response_type: "range",
            factor: 2,
            minimize: true,
          }
        }
      ]
    } as ArticlePartner;

    jest.spyOn(articleRepository, 'findOne').mockResolvedValueOnce(undefined);

    const result = await serviceArticlePartner.update(id, body, req);
    expect(result).toEqual({ status: HttpStatus.NOT_FOUND, content: 'Id not found' });
  });

  it('should retrieve articles by user ID', async () => {
    const decodedToken = { email: 'test1@example.com' };
    const req = {
      headers: {
        authorization: `Bearer ${jwt.sign(decodedToken, '123456')}`,
      },
    };

    jest.spyOn(articleRepository, 'find').mockResolvedValueOnce([{
      id: 'a',
      email: "test1@example.com",
      name: "Pascal",
      brand: "Prout",
      country: JSON.stringify([{name: 'france'}, {name: 'korea'}]),
      material: JSON.stringify([{name: 'wood'}]),
      transport: JSON.stringify([{name: 'plane'}]),
      branddesc: "un t-shirt noir bon pour l'environnement",
      image: Buffer.from("https://planetgrimpe.com/wp-content/uploads/2018/08/logo-1024x369.png", 'utf-8'),
      brandlogo: Buffer.from("https://planetgrimpe.com/wp-content/uploads/2018/08/logo-1024x369.png", 'utf-8'),
      price: 90.99,
      ethicaldesc: "Lorem ipsum ethical description",
      environnementdesc: "Lorem ipsum environmental description",
      description: "",
      ethical_score: 20,
      ecological_score: 20,
      local_score: 20,
      rgb: [20, 355, 52]
    }]);

    const result = await serviceArticlePartner.getArticlesByUserId(req);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.content).toBe('OK');
    expect(result.articles).toHaveLength(1);
    expect(result.articles[0].email).toBe('test1@example.com');
  });

  it('error during articles retrieve by user ID', async () => {
    const decodedToken = { email: 'test@example.com' };
    const req = {
      headers: {
        authorization: `Bearer ${jwt.sign(decodedToken, '123456')}`,
      },
    };

    jest.spyOn(articleRepository, 'find').mockResolvedValueOnce(undefined);

    const result = await serviceArticlePartner.getArticlesByUserId(req);
    expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(result.content).toBe('A problem occurred with the repository');
    expect(result.articles).toHaveLength(0);
  });

  it('no articles retrieve by user ID', async () => {
    const decodedToken = { email: 'test@example.com' };
    const req = {
      headers: {
        authorization: `Bearer ${jwt.sign(decodedToken, '123456')}`,
      },
    };

    jest.spyOn(articleRepository, 'find').mockResolvedValueOnce([]);

    const result = await serviceArticlePartner.getArticlesByUserId(req);
    expect(result.status).toBe(HttpStatus.NOT_FOUND);
    expect(result.content).toBe('Id not found');
    expect(result.articles).toHaveLength(0);
  });

  it('should get a list of filtered articles successfully', async () => {
    const filters = 'brand==SampleBrand:name==SampleName';
    const queryBuilderMock: SelectQueryBuilder<ArticlePartner> = {
      where: jest.fn(),
      getMany: jest.fn(),
    } as any;

    jest.spyOn(articleRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock);


    const result = await serviceArticlePartner.getArticlePublicList(filters);

    expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(result.content).toBe('A problem occurred with the repository');
    expect(result.articles).toEqual([]);
  });
});