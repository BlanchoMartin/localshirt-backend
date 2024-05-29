import {HttpStatus, Injectable} from '@nestjs/common';
import { validate } from 'class-validator';
import { LoggerService } from '../../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Criteria } from '../../database/entities/criteria.entity';
import { ArticleWeb } from '../../database/entities/article.web.entity';
import { ArticleWebDTO } from './dto/article.web.dto';
import {
  ArticleWebResponse,
  CountryInput, MaterialInput,
  TransportInput
} from './article.web.model';
import { Cron } from '@nestjs/schedule';
import {computeScore, ScoreApplication} from '../computeScore';
import client from "../../graphqlApollo";
import {cleanDetails} from "../partner/article.partner.service";

@Injectable()
export class ArticleWebService {
  constructor(
      private logger: LoggerService,
      @InjectRepository(ArticleWeb)
      private articleWebRepository: Repository<ArticleWeb>,
      @InjectRepository(Criteria)
      private criteriaRepository: Repository<Criteria>,
  ) {}

  @Cron(`*/${Number(process.env.ARTICLE_WEB_CLEANER_INTERVAL)} * * * *`)
  async deleteExpiredArticleWeb() {
    await this.articleWebRepository.find().then((articlesWeb) => {
      const date = new Date().getTime();

      articlesWeb.forEach((article) => {
        if (
            date - article.creation_date.getTime() >
            Number(process.env.ARTICLE_WEB_MAX_KEEP_TIME) * 60000
        ) {
          this.deleteById(article.id);
        }
      });
    });
  }

  async createArticleFromDTO (
      articleWebDTO: ArticleWebDTO,
  ): Promise<ArticleWeb> {
    const articleWeb: ArticleWeb = new ArticleWeb();

    const getMainClothesGoogleDataQuery = `
      query getMainClothesGoogleData($image: String!) {
        getMainClothesGoogleData(image: $image) {
          status,
          content
        }
      }
    `;

    const cropImageToObjectQuery = `
      query cropImageToObject($image: String!, $object: String!) {
        cropImageToObject(image: $image, object: $object) {
          status,
          content
        }
      }
    `;

    const getImageMainColorQuery = `
      query getImageMainColor($image: String!) {
        getImageMainColor(image: $image) {
          status,
          content
        }
      }
    `;

    const getObjectDetailsQuery = `
      query getObjectDetails($image: String!) {
        getObjectDetails(image: $image) {
          status,
          content
        }
      }
    `;

    const types = [{name: 'top', content: ['top', 'shirt']}, {name: 'pantalon', content: []}, {name: 'robe', content: []}, {name: 'jupe', content: []}, {name: 'manteau', content: []}, {name: 'accessoire', content: []}]
    let imageData: { getMainClothesGoogleData: { status: number, content: string } } = null;
    try {
      imageData = await client.request(getMainClothesGoogleDataQuery, {image: articleWebDTO.image});
      if (imageData.getMainClothesGoogleData.status != HttpStatus.OK) console.error(imageData.getMainClothesGoogleData.content)
    } catch (err) {
      console.error('imageData', err.message)
      articleWeb.type = 'unknown';
      articleWeb.image_data = '{}';
      articleWeb.rgb = [-1, -1, -1];
    }
    if (imageData != null && imageData.getMainClothesGoogleData.status == HttpStatus.OK) {
      const imageDataContent = JSON.parse(imageData.getMainClothesGoogleData.content);
      if (!imageDataContent.name)
        articleWeb.type = 'unknown';
      else {
        const correspondingType = types.find(elem => elem.content.find(elem2 => elem2 == imageDataContent.name.toLowerCase()));
        if (correspondingType)
          articleWeb.type = correspondingType.name;
        else
          articleWeb.type = imageDataContent.name.toLowerCase();
      }
      let croppedImage: { cropImageToObject: { status: number, content: string } } = null;
      try {
        croppedImage = await client.request(cropImageToObjectQuery, {
          image: articleWebDTO.image,
          object: imageData.getMainClothesGoogleData.content
        })
      } catch (err) {
        console.error('croppedImage', err.message)
        articleWeb.image_data = '{}';
        articleWeb.rgb = [-1, -1, -1];
      }
      if (!croppedImage || croppedImage.cropImageToObject.status != HttpStatus.OK) {
        articleWeb.image_data = '{}';
        articleWeb.rgb = [-1, -1, -1];
      } else {
        let clotheContent: { getObjectDetails: { status: number, content: string } } = null;
        try {
          clotheContent = await client.request(getObjectDetailsQuery, {image: croppedImage.cropImageToObject.content});
        } catch (err) {
          console.error('clotheContent', err.message)
          articleWeb.image_data = '{}';
          articleWeb.rgb = [-1, -1, -1];
        }
        if (clotheContent) {
          clotheContent.getObjectDetails.content = cleanDetails(clotheContent);
          articleWeb.image_data = JSON.stringify({clothe: "imageData", details: clotheContent})
          let color: {
            getImageMainColor: { status: number, content: string }
          } = null;
          try {
            color = await client.request(getImageMainColorQuery, {image: croppedImage.cropImageToObject.content});
          } catch (err) {
            console.error('color', err.message);
            articleWeb.rgb = [-1, -1, -1];
          }
          if (!color || color.getImageMainColor.status != HttpStatus.OK) {
            articleWeb.rgb = [-1, -1, -1];
          } else {
            const rgb = JSON.parse(color.getImageMainColor.content);
            if (rgb.red && rgb.blue && rgb.green) articleWeb.rgb = [rgb.red, rgb.green, rgb.blue]; else articleWeb.rgb = [-1, -1, -1];
          }
        } else {
          articleWeb.image_data = '{}';
          articleWeb.rgb = [-1, -1, -1];
        }
      }
    } else {
      articleWeb.type = 'unknown';
      articleWeb.image_data = '{}';
      articleWeb.rgb = [-1, -1, -1];
    }

    articleWeb.brand = articleWebDTO.brand;
    articleWeb.name = articleWebDTO.name;
    articleWeb.url = articleWebDTO.url;
    articleWeb.country = articleWebDTO.country;
    articleWeb.material = articleWebDTO.material;
    articleWeb.transport = articleWebDTO.transport;
    articleWeb.price = articleWebDTO.price;
    articleWeb.image = Buffer.from(articleWebDTO.image, 'utf-8');

    const criteria: Criteria = {
      tag: '',
      ethical_score: -1,
      local_score: -1,
      ecological_score: -1,
      id: '',
      type: '',
      additionalCriteria: JSON.stringify(JSON.parse(articleWebDTO.country)
          .map((criteria) => {
            return {
              result: criteria.name,
              question: {
                questionId: '',
                criteria_application: 'all',
                factor: 1,
                minimize: false,
                user_response_type: 'criteria',
              },
            };
          })
          .concat(
              JSON.parse(articleWebDTO.transport).map((criteria) => {
                return {
                  result: criteria.name,
                  question: {
                    questionId: '',
                    criteria_application: 'all',
                    factor: 1,
                    minimize: false,
                    user_response_type: 'criteria',
                  },
                };
              }),
          )
          .concat(
              JSON.parse(articleWebDTO.material).map((criteria) => {
                return {
                  result: criteria.name,
                  question: {
                    questionId: '',
                    criteria_application: 'all',
                    factor: 1,
                    minimize: false,
                    user_response_type: 'criteria',
                  },
                };
              }),
          ))
    }

    let score = await computeScore(criteria, ScoreApplication.ECOLOGICAL, this.criteriaRepository);
    articleWeb.ecological_score = score.score;
    score = await computeScore(criteria, ScoreApplication.ETHICAL, this.criteriaRepository);
    articleWeb.ethical_score = score.score;
    articleWeb.local_score = Math.floor(
        (articleWeb.ecological_score + articleWeb.ethical_score) / 2,
    );
    articleWeb.creation_date = new Date();
    return articleWeb;
  }

  async checkDTO(body: {
    name: string,
    url: string,
    brand: string,
    country: CountryInput[],
    material: MaterialInput[],
    transport: TransportInput[],
    price: number,
    image: string
  }, articleWebDTO: ArticleWebDTO): Promise<boolean> {
    articleWebDTO.brand = body.brand;
    articleWebDTO.name = body.name;
    articleWebDTO.url = body.url;
    articleWebDTO.country = JSON.stringify(body.country)
    articleWebDTO.material = JSON.stringify(body.material);
    articleWebDTO.transport = JSON.stringify(body.transport);
    articleWebDTO.price = Math.round(body.price);
    articleWebDTO.image = body.image;
    return await validate(articleWebDTO).then((errors) => {
      if (errors.length > 0) {
        this.logger.debug(`${errors}`, ArticleWebService.name);
        return false;
      } else {
        return true;
      }
    });
  }

  async create(body: {
    name: string,
    url: string,
    brand: string,
    country: CountryInput[],
    material: MaterialInput[],
    transport: TransportInput[],
    price: number,
    image: string
  }): Promise<ArticleWebResponse> {
    const articleWebDTO: ArticleWebDTO = new ArticleWebDTO();
    let isOk: boolean = await this.checkDTO(body, articleWebDTO);
    if (!isOk) {
      return {
        status: HttpStatus.BAD_REQUEST,
        devMessage: 'Invalid content (ArticleWebService:create:DTO)',
        userMessage: `Le contenu de la requête est invalide.`
      };
    }
    try {
      await this.articleWebRepository.save(await this.createArticleFromDTO(articleWebDTO));
    } catch (error) {
      isOk = false;
      console.error(error);
    }
    if (isOk) {
      while (await this.articleWebRepository.count() > Number(process.env.ARTICLE_WEB_MAX_NUMBER)) {
        await this.deleteOlder();
      }
      return { status: HttpStatus.OK, devMessage: 'OK', userMessage: `L'article a été collecté avec succès pour être comparé.` };
    } else {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        devMessage: 'A problem occurred with the repository (ArticleWebService:create:save)',
        userMessage: 'Une erreur est survenue lors de la création de la collection de la page web. Veuillez réessayer plus tard.'
      };
    }
  }

  async deleteOlder(): Promise<void> {
    const articlesWeb: ArticleWeb[] = await this.articleWebRepository.find();
    let older: number = 0;

    for (let i = 0; i < articlesWeb.length; i++) {
      if (
          articlesWeb[i].creation_date.getTime() <
          articlesWeb[older].creation_date.getTime()
      )
        older = i;
    }
    await this.deleteById(articlesWeb[older].id);
  }

  async deleteById(id: string): Promise<ArticleWebResponse> {
    const articleWeb: ArticleWeb = await this.articleWebRepository.findOne({
      where: { id },
    });

    if (articleWeb) {
      await this.articleWebRepository.remove(articleWeb);
      return { status: HttpStatus.OK, devMessage: 'OK', userMessage: 'L\'article a été supprimé avec succès.' };
    } else {
      return { status: HttpStatus.NOT_FOUND, devMessage: 'Id not found (ArticleWebService:deleteById:remove)', userMessage: 'L\'identifiant spécifié n\'a pas été trouvé.' };
    }
  }

  async updateById(body: {
    id: string
    name: string,
    url: string,
    brand: string,
    country: CountryInput[],
    material: MaterialInput[],
    transport: TransportInput[],
    price: number,
    image: string
  }): Promise<ArticleWebResponse> {
    try {
      const articleInfo: ArticleWeb = await this.articleWebRepository.findOne({
        where: { id: body.id },
      });
      if (!articleInfo) {
        return { status: HttpStatus.NOT_FOUND, devMessage: 'Id not found (ArticleWebService:updateById:findOne)', userMessage: 'L\'identifiant spécifié n\'a pas été trouvé.' };
      }

      const propertiesToUpdate = [
        'name',
        'url',
        'brand',
        'country',
        'material',
        'transport',
        'price',
        'picture_data'
      ];

      propertiesToUpdate.forEach((property) => {
        if (body[property] !== null) {
          articleInfo[property] = body[property];
        }
      });

      await this.articleWebRepository.save(articleInfo);

      return { status: HttpStatus.OK, devMessage: 'OK', userMessage: 'L\'article a été mis à jour avec succès.' };
    } catch (error) {
      console.error(error.message);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        devMessage: 'A problem occurred with the repository (ArticleWebService:updateById:save)',
        userMessage: 'Une erreur est survenue lors de la création de la collection de la page web. Veuillez réessayer plus tard.'
      };
    }
  }

  async isArticleUrlAlreadyParsed(url: string) {
    const foundArticle = await this.articleWebRepository.findOne({ where: { url: url } });
    if (!foundArticle)
      return null;
    return foundArticle;
  }
}