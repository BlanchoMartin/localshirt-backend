import {HttpStatus, Injectable} from '@nestjs/common';
import {ArticlePartner} from '../database/entities/article.partner.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ScraperService} from '../scraper/scraper.service';
import {ArticlePartnerService} from '../article/partner/article.partner.service';
import {Users} from '../database/entities/users.entity';
import {ArticlePartnerListResponse, ArticlePartnerStruct, ImageReturn,} from '../article/partner/article.partner.model';
import * as path from 'path';
import {createWriteStream} from 'fs';
import {ArticleWebService} from '../article/web/article.web.service';
import {ArticleWeb} from "../database/entities/article.web.entity";
import {google} from "@google-cloud/vision/build/protos/protos";
import {ArticleDto} from "../article/partner/dto/article.dto";
import client from "../graphqlApollo";
import INormalizedVertex = google.cloud.vision.v1.INormalizedVertex;

@Injectable()
export class AnalysisService {
    constructor(@InjectRepository(ArticlePartner) private articleRepository: Repository<ArticlePartner>, @InjectRepository(ArticleWeb) private articleWebRepository: Repository<ArticleWeb>, private scraperService: ScraperService, private ArticleService: ArticlePartnerService, private ArticleWebService: ArticleWebService, @InjectRepository(Users) private usersRepository: Repository<Users>,) {
    }

    static computeRectangleArea(points: INormalizedVertex[]): number {
        if (points.length != 4) return -1;
        return (points[0].x * points[1].y - points[1].x * points[0].y + (points[1].x * points[2].y - points[2].x * points[1].y) + (points[2].x * points[3].y - points[3].x * points[2].y) + (points[3].x * points[0].y - points[0].x * points[3].y));
    }

    static getIntersectionAreaVertices(rect1: INormalizedVertex[], rect2: INormalizedVertex[]): number {
        if (rect1.length != 4 || rect2.length != 4) return -1;

        if (rect1[1].x <= rect2[0].x || rect1[3].y <= rect2[0].y || rect1[0].x >= rect2[1].x || rect1[0].y >= rect2[3].y) return 0
        const xArr = [rect1[0].x, rect1[1].x, rect2[0].x, rect2[1].x].sort()
        const yArr = [rect1[0].y, rect1[3].y, rect2[0].y, rect2[3].y].sort()

        const res: INormalizedVertex[] = [];
        res.push({x: xArr[1], y: yArr[1]})
        res.push({x: xArr[2], y: yArr[1]})
        res.push({x: xArr[2], y: yArr[2]})
        res.push({x: xArr[1], y: yArr[2]})
        return this.computeRectangleArea(res);
    }

    static convertArticlePartnerListToArticlePartnerStructList(article: ArticlePartner[]): ArticlePartnerStruct[] {
        return article.map(article => {
            return {
                ...article,
                image: article.image.toString('utf-8'),
                brandlogo: article.brandlogo.toString('utf-8'),
                country: JSON.parse(article.country),
                transport: JSON.parse(article.transport),
                material: JSON.parse(article.material),
                type: article.type,
                lastbought: article.lastbought,
                lastshown: article.lastshown,
                lastclick: article.lastclick,
            }
        })
    }

    static orderBySharedArea(articleWeb, articlesPartner): ArticlePartnerStruct[] {
        let maxAreaSum = 0;
        const articlePartnerArraySorted: { article: ArticlePartner, areaSum: number }[] = []
        let imageData = null;
        let imageDataContent = null;
        try {
            imageData = JSON.parse(articleWeb.image_data);
            imageDataContent = JSON.parse(imageData.details.getObjectDetails.content)
        } catch (err) {
            console.error(err.message);
            return [];
        }
        imageDataContent.forEach(webArticleDetail => {
            if (webArticleDetail == null) return
            const areaRect = AnalysisService.computeRectangleArea(webArticleDetail.boundingPoly.normalizedVertices);
            if (areaRect > 0) maxAreaSum += areaRect;
        });
        articlesPartner.forEach(articlePartner => {
            let areaSum = 0
            let imagePartnerData = null;
            let imagePartnerDataContent = null;
            try {
                imagePartnerData = JSON.parse(articlePartner.image_data);
                imagePartnerDataContent = JSON.parse(imagePartnerData.details.getObjectDetails.content);
            } catch (err) {
                return [];
            }
            imagePartnerDataContent.forEach(articlePartnerDetail => {
                if (!articlePartnerDetail) return [];
                imageDataContent.forEach(webArticleDetail => {
                    if (webArticleDetail == null) return
                    const area = AnalysisService.getIntersectionAreaVertices(articlePartnerDetail.boundingPoly.normalizedVertices, webArticleDetail.boundingPoly.normalizedVertices);
                    areaSum += area;
                })
            })
            if (areaSum > maxAreaSum) areaSum = 0;
            let i = 0;
            while (i < articlePartnerArraySorted.length && articlePartnerArraySorted[i].areaSum >= areaSum) i++;
            articlePartnerArraySorted.splice(i, 0, {article: articlePartner, areaSum: areaSum})
        })
        return this.convertArticlePartnerListToArticlePartnerStructList(articlePartnerArraySorted.map(article => article.article));
    }

    static orderByAmountOfDetails(articleWeb, articlePartner) {
        let maxAreaSum = 0;
        const articlePartnerArraySorted: { article: ArticlePartner, areaSumDiff: number }[] = []
        let imageData = null;
        let imageDataContent = null;
        try {
            imageData = JSON.parse(articleWeb.image_data);
            imageDataContent = JSON.parse(imageData.details.getObjectDetails.content)
        } catch (err) {
            console.error(err.message)
            return [];
        }
        imageDataContent.forEach(webArticleDetail => {
            if (webArticleDetail == null) return;
            maxAreaSum += AnalysisService.computeRectangleArea(webArticleDetail.boundingPoly.normalizedVertices)
        });
        articlePartner.forEach(articlePartner => {
            let areaSum = 0
            let imageDataPartner = null;
            let imageDataContentPartner = null;
            try {
                imageDataPartner = JSON.parse(articlePartner.image_data);
                imageDataContentPartner = JSON.parse(imageDataPartner.details.getObjectDetails.content)
            } catch (err) {
                console.error(err.message)
                return [];
            }
            imageDataContentPartner.forEach(articlePartnerDetail => {
                if (!articlePartnerDetail) return [];
                areaSum += this.computeRectangleArea(articlePartnerDetail.boundingPoly.normalizedVertices);
            })
            let i = 0;
            while (i < articlePartnerArraySorted.length && articlePartnerArraySorted[i].areaSumDiff <= Math.abs(maxAreaSum - areaSum)) i++;
            articlePartnerArraySorted.splice(i, 0, {
                article: articlePartner,
                areaSumDiff: Math.abs(maxAreaSum - areaSum)
            })
        })
        return this.convertArticlePartnerListToArticlePartnerStructList(articlePartnerArraySorted.map(article => article.article))
    }

    static computeRgbDistance(color1: number[], color2: number[]): number {
        if (color1.length != 3 || color2.length != 3) return -1;
        const squaredDistance = color1.reduce((acc, val, index) => {
            const diff = val - color2[index];
            return acc + diff * diff;
        }, 0);

        return Math.sqrt(squaredDistance);
    }

    static orderByColor(articleWeb, articlePartner, colorThreshold) {
        const articlePartnerArraySorted: { article: ArticlePartner, distance: number }[] = []
        articlePartner.forEach(article => {
            const distance = this.computeRgbDistance(articleWeb.rgb, article.rgb);
            if (distance > colorThreshold) return;
            let i = 0;
            while (i < articlePartnerArraySorted.length && articlePartnerArraySorted[i].distance <= distance) i++;
            articlePartnerArraySorted.splice(i, 0, {article: article, distance: distance})
        })
        return this.convertArticlePartnerListToArticlePartnerStructList(articlePartnerArraySorted.map(article => article.article))
    }

    async getAllArticle(minPrice, maxPrice) {
        return await this.ArticleService.getAllArticlesPartner().then((articles) => {
            if (minPrice >= 0 && maxPrice > minPrice) articles.articles = articles.articles.filter((article) => article.price >= minPrice && article.price <= maxPrice,);
            return articles.articles
        },)
    }


    async findAlternativebyImage(image: string, minPrice: number, maxPrice: number, likeliness: number): Promise<ArticlePartnerListResponse> {
        const article = new ArticlePartner();

        const cleanDetails = (content: { getObjectDetails: { status: number, content: string } }) => {
            const oldContent = JSON.parse(content.getObjectDetails.content)
            const newContent = [];
            oldContent.map(elem => {
                const isPresent = newContent.find(elem2 => elem2.description == elem.description);
                if (isPresent) return;
                newContent.push(elem);
            })
            return JSON.stringify(newContent);
        }

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


        let imageData: { getMainClothesGoogleData: { status: number, content: string } } = null;
        try {
            imageData = await client.request(getMainClothesGoogleDataQuery, {image: image});
            if (imageData.getMainClothesGoogleData.status != HttpStatus.OK) console.error(imageData.getMainClothesGoogleData.content)
        } catch (err) {
            console.error(err.message)
            article.type = 'unknown';
            article.image_data = '{}';
            article.rgb = [-1, -1, -1];
        }
        if (imageData != null && imageData.getMainClothesGoogleData.status == HttpStatus.OK) {
            const imageDataContent = JSON.parse(imageData.getMainClothesGoogleData.content);
            if (!imageDataContent.name) article.type = 'unknown'; else article.type = imageDataContent.name.toLowerCase();
            let croppedImage: { cropImageToObject: { status: number, content: string } } = null;
            try {
                croppedImage = await client.request(cropImageToObjectQuery, {
                    image: image, object: imageData.getMainClothesGoogleData.content
                })
            } catch (err) {
                console.error(err.message)
                console.log('3')
                article.image_data = '{}';
                article.rgb = [-1, -1, -1];
            }
            if (!croppedImage || croppedImage.cropImageToObject.status != HttpStatus.OK) {
                article.image_data = '{}';
                article.rgb = [-1, -1, -1];
            } else {
                let clotheContent: { getObjectDetails: { status: number, content: string } } = null;
                try {
                    clotheContent = await client.request(getObjectDetailsQuery, {image: croppedImage.cropImageToObject.content});
                } catch (err) {
                    console.error(err.message)
                    console.log('2')
                    article.image_data = '{}';
                    article.rgb = [-1, -1, -1];
                }
                if (clotheContent) {
                    clotheContent.getObjectDetails.content = cleanDetails(clotheContent);
                    article.image_data = JSON.stringify({clothe: "imageData", details: clotheContent})
                    let color: {
                        getImageMainColor: { status: number, content: string }
                    } = null;
                    try {
                        color = await client.request(getImageMainColorQuery, {image: croppedImage.cropImageToObject.content});
                    } catch (err) {
                        console.error(err.message);
                        console.log('1')
                        article.rgb = [-1, -1, -1];
                    }
                    if (!color || color.getImageMainColor.status != HttpStatus.OK) {
                        article.rgb = [-1, -1, -1];
                    } else {
                        const rgb = JSON.parse(color.getImageMainColor.content);
                        if (rgb.red && rgb.blue && rgb.green) article.rgb = [rgb.red, rgb.green, rgb.blue]; else article.rgb = [-1, -1, -1];
                    }
                } else {
                    article.image_data = '{}';
                    article.rgb = [-1, -1, -1];
                }
            }
        } else {
            article.type = 'unknown';
            article.image_data = '{}';
            article.rgb = [-1, -1, -1];
        }
        console.log(article)
        if (article) {
            let red: number = -1;
            red = article.rgb[0]
            let green: number = -1;
            green = article.rgb[1]
            let blue: number = -1;
            blue = article.rgb[2]
            if (red >= 0 && green >= 0 && blue >= 0) {
                const res = await this.articleRepository.find({where: {type: article.type}})
                let articlePartnerArraySorted: {
                    article: ArticlePartnerStruct,
                    grade: number
                }[] = AnalysisService.orderByColor(article, res, (likeliness >= 0 ? 100 - likeliness : 0) * 5).map((elem, index) => {
                    return {
                        article: elem, grade: 100 / (index + 1) * 1.5
                    }
                });
                articlePartnerArraySorted = AnalysisService.orderBySharedArea(article, res).map((elem, index) => {
                    const article = articlePartnerArraySorted.find(elem2 => elem2.article.id == elem.id);
                    if (!article) return null
                    return {
                        article: elem, grade: (100 / (index + 1)) + article.grade
                    }
                });
                articlePartnerArraySorted = AnalysisService.orderByAmountOfDetails(article, res).map((elem, index) => {
                    const article = articlePartnerArraySorted.find(elem2 => elem2.article.id == elem.id);
                    if (!article) return null
                    return {
                        article: elem, grade: (100 / (index + 1)) + article.grade
                    }
                });
                articlePartnerArraySorted.sort((a, b) => b.grade - a.grade)
                return {
                    status: HttpStatus.OK,
                    devMessage: 'OK',
                    userMessage: 'OK',
                    articles: articlePartnerArraySorted.map(elem => elem.article)
                };
            } else return this.ArticleService.getAllArticlesPartner().then((articles) => {
                if (minPrice >= 0 && maxPrice > minPrice) articles.articles = articles.articles.filter((article) => article.price >= minPrice && article.price <= maxPrice,);
                const currentDate: Date = new Date();
                const updatePromises = articles.articles.map(async (article) => {
                    const articleToUpdate = await this.articleRepository.findOne({where: {id: article.id}});
                    if (articleToUpdate) {
                        articleToUpdate.lastshown = currentDate;
                        await this.articleRepository.save(articleToUpdate);
                    }
                });
                return articles;
            },);
        }
    }

    async findAlternative(URL: string, likeliness: number, minPrice: number, maxPrice: number,): Promise<ArticlePartnerListResponse> {
        try {
            let articleWeb = await this.ArticleWebService.isArticleUrlAlreadyParsed(URL);
            if (!articleWeb) {
                const scrapedArticle = await this.scraperService.ScrapeSite(URL);
                if (scrapedArticle) await this.ArticleWebService.create({
                    name: scrapedArticle.name,
                    url: scrapedArticle.url,
                    brand: scrapedArticle.brand,
                    country: scrapedArticle.country,
                    material: scrapedArticle.material,
                    transport: scrapedArticle.transport,
                    price: Number(scrapedArticle.price),
                    image: scrapedArticle.image.toString()
                });
                articleWeb = await this.articleWebRepository.findOne({where: {url: URL}});
            }
            if (articleWeb) {
                let red: number = -1;
                red = articleWeb.rgb[0]
                let green: number = -1;
                green = articleWeb.rgb[1]
                let blue: number = -1;
                blue = articleWeb.rgb[2]
                if (red >= 0 && green >= 0 && blue >= 0) {
                    const res = await this.articleRepository.find({where: {type: articleWeb.type}})
                    let articlePartnerArraySorted: {
                        article: ArticlePartnerStruct,
                        grade: number
                    }[] = AnalysisService.orderByColor(articleWeb, res, (likeliness >= 0 ? 100 - likeliness : 0) * 5).map((elem, index) => {
                        return {
                            article: elem, grade: 100 / (index + 1) * 1.5
                        }
                    });
                    articlePartnerArraySorted = AnalysisService.orderBySharedArea(articleWeb, res).map((elem, index) => {
                        const article = articlePartnerArraySorted.find(elem2 => elem2.article.id == elem.id);
                        if (!article) return null
                        return {
                            article: elem, grade: (100 / (index + 1)) + article.grade
                        }
                    });
                    articlePartnerArraySorted = AnalysisService.orderByAmountOfDetails(articleWeb, res).map((elem, index) => {
                        const article = articlePartnerArraySorted.find(elem2 => elem2.article.id == elem.id);
                        if (!article) return null
                        return {
                            article: elem, grade: (100 / (index + 1)) + article.grade
                        }
                    });
                    articlePartnerArraySorted.sort((a, b) => b.grade - a.grade)
                    return {
                        status: HttpStatus.OK,
                        devMessage: 'OK',
                        userMessage: 'OK',
                        articles: articlePartnerArraySorted.map(elem => elem.article).filter(elem2 => (elem2.price >= minPrice || minPrice == -1) && (elem2.price <= maxPrice || maxPrice == -1))
                    };
                } else return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    devMessage: 'A problem occurred with the repository (findAlternative:articleWeb:rgb)',
                    userMessage: "The rgb digits of the article isn't conform",
                    articles: await this.getAllArticle(minPrice, maxPrice)
                };
            }
        } catch (error) {
            console.error('Error while scraping:', error);
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                devMessage: 'A problem occurred with the repository (findAlternative:scraping)',
                userMessage: "Couldn't scrap proprely",
                articles: await this.getAllArticle(minPrice, maxPrice)
            };
        }
    }

    async uploadImages(file: any): Promise<ImageReturn> {
        const uploadPath = path.join(__dirname, 'uploads');
        const fileName = `${Date.now()}-${file.originalname}`;

        await this.saveFile(file.buffer, path.join(uploadPath, fileName));

        const imagePath = path.join('uploads', fileName);

        return {content: imagePath};
    }

    private saveFile(buffer: Buffer, filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const writeStream = createWriteStream(filePath);
            writeStream.write(buffer);
            writeStream.end();
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
    }
}