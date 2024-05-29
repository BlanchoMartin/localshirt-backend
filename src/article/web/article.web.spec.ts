import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { instance, mock } from 'ts-mockito';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { LoggerService } from '../../logger/logger.service';
import { Criteria } from '../../database/entities/criteria.entity';
import { ArticleWebService } from './article.web.service';
import { ArticleWeb } from '../../database/entities/article.web.entity';
import {
  CountryInput,
  MaterialInput,
  PictureDataInput,
  TransportInput,
} from './article.web.model';
import { ArticleWebResolver } from './article.web.resolver';
import {HttpStatus} from "@nestjs/common";

describe('ArticleWebService', () => {
  let serviceArticleWeb: ArticleWebService;
  let repositoryArticleWeb: Repository<ArticleWeb>;
  let repositoryCriteria: Repository<Criteria>;

  let repositoryTokenArticleWeb: string | Function =
    getRepositoryToken(ArticleWeb);
  let repositoryTokenCriteria: string | Function = getRepositoryToken(Criteria);
  let resolver: ArticleWebResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        JwtService,
        ArticleWebService,
        {
          provide: getRepositoryToken(ArticleWeb),
          useValue: instance(mock(Repository)),
        },
        {
          provide: getRepositoryToken(Criteria),
          useValue: instance(mock(Repository)),
        },
      ],
    }).compile();

    serviceArticleWeb = module.get<ArticleWebService>(ArticleWebService);
    repositoryArticleWeb = module.get(repositoryTokenArticleWeb);
    repositoryCriteria = module.get(repositoryTokenCriteria);
    resolver = new ArticleWebResolver(serviceArticleWeb);
  }, 60000);

  it('should be defined', () => {
    expect(serviceArticleWeb).toBeDefined();
  });

  it('successfully create article', async () => {
    const result = await resolver.createArticleWeb(
      'thsirt blanc',
      'https://www.nike.com/fr/t/tee-shirt-sportswear-essentials-pour-xhtqlJ/DO7392-323',
      'nike',
      [{ name: 'france' }],
      [
        {
          name: 'coton',
          percent: 100,
        },
      ],
      [{ name: 'plane', percent: 100 }],
      90,
      {
        type: 't-shirt',
        color: [{ rgb: [255, 255, 255], percent: 100 }],
      },
    );

    expect(result).toEqual({
      status: HttpStatus.OK,
      content: 'OK',
    });
  });

  it('successfully update article', async () => {
    jest.spyOn(repositoryArticleWeb, 'findOne').mockResolvedValueOnce({
      id: 'a',
      name: '',
      url: '',
      picture_data: '',
      material: '',
      price: 0,
      transport: '',
      brand: '',
      country: '',
      ecological_score: 0,
      ethical_score: 0,
      local_score: 0,
      creation_date: new Date(),
    });

    const result = await resolver.updateArticleWebById(
      'a',
      'thsirt blanc',
      'https://www.nike.com/fr/t/t-shirt-de-skateboard-sb-VqFVCS/FQ3719-010',
      'nike',
      [{ name: 'france' }],
      [
        {
          name: 'coton',
          percent: 100,
        },
      ],
      [{ name: 'plane', percent: 100 }],
      90,
      {
        type: 't-shirt',
        color: [{ rgb: [255, 255, 255], percent: 100 }],
      },
    );
    expect(result).toEqual({
      status: HttpStatus.OK,
      content: 'OK',
    });
  });

  it('could not update article, not found', async () => {
    const result = await resolver.updateArticleWebById(
      'a',
      'thsirt blanc',
      'https://www.nike.com/fr/t/t-shirt-de-skateboard-sb-VqFVCS/FQ3719-010',
      'nike',
      [{ name: 'france' }],
      [
        {
          name: 'coton',
          percent: 100,
        },
      ],
      [{ name: 'plane', percent: 100 }],
      90,
      {
        type: 't-shirt',
        color: [{ rgb: [255, 255, 255], percent: 100 }],
      },
    );
    expect(result).toEqual({
      status: HttpStatus.NOT_FOUND,
      content: 'Id not found',
    });
  });

  it('successfully delete article', async () => {
    jest.spyOn(repositoryArticleWeb, 'findOne').mockResolvedValueOnce({
      id: 'a',
      name: '',
      url: '',
      picture_data: '',
      material: '',
      price: 0,
      transport: '',
      brand: '',
      country: '',
      ecological_score: 0,
      ethical_score: 0,
      local_score: 0,
      creation_date: new Date(),
    });

    const result = await resolver.deleteArticleWebById('a');
    expect(result).toEqual({
      status: HttpStatus.OK,
      content: 'OK',
    });
  });

  it('could not find article to delete', async () => {
    const result = await resolver.deleteArticleWebById('a');
    expect(result).toEqual({
      status: HttpStatus.NOT_FOUND,
      content: 'Id not found',
    });
  });

  it('successfully checked if article is already parsed', async () => {
    jest.spyOn(repositoryArticleWeb, 'findOne').mockResolvedValueOnce({
      id: 'a',
      name: '',
      url: 'https://www.nike.com/fr/t/t-shirt-de-skateboard-sb-VqFVCS/FQ3719-010',
      picture_data:
        '{"type":"t-shirt","color":[{"rgb":[255,255,255],"percent":100}]}',
      material: '[{"name":"coton","percent":100}]',
      price: 0,
      transport: '[{"name":"plane","percent":100}]',
      brand: '',
      country: '[{"name":"france"}]',
      ecological_score: 0,
      ethical_score: 0,
      local_score: 0,
      creation_date: new Date(),
    });

    const result = await resolver.isArticleUrlAlreadyParsed(
      'https://www.nike.com/fr/t/t-shirt-de-skateboard-sb-VqFVCS/FQ3719-010',
    );
    expect(result).toEqual({
      id: 'a',
      name: '',
      url: 'https://www.nike.com/fr/t/t-shirt-de-skateboard-sb-VqFVCS/FQ3719-010',
      picture_data: {
        type: 't-shirt',
        color: [{ rgb: [255, 255, 255], percent: 100 }],
      },
      material: [{ name: 'coton', percent: 100 }],
      price: 0,
      transport: [{ name: 'plane', percent: 100 }],
      brand: '',
      country: [{ name: 'france' }],
      ecological_score: 0,
      ethical_score: 0,
      local_score: 0,
    });
  });
});
