import { Injectable } from '@nestjs/common';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import axios from 'axios';
const request = require('request');

import { clothingColorList } from '../constants/colorsConstant';
import { clothingTypeList } from '../constants/clothingTypeConstant';

export { clothingColorList, clothingTypeList };

import { materialList } from '../constants/materialsConstant';
import { colorMap } from '../constants/colorsConstant';

import { IsPathAllowed, GetCrawlDelay } from './Scrapers/RobotTxT_Handler';
import { ScrapeNike } from './Scrapers/ScrapNike';
import { ScrapeVeja } from './Scrapers/ScrapVeja';
import { ScrapeShein } from './Scrapers/ScrapShein';
import { ScrapeAsos } from './Scrapers/ScrapAsos';
import { ScrapeMango } from './Scrapers/ScrapMango';
import { ScrapeUniqlo } from './Scrapers/ScrapUniqlo';
import { ScrapDefault } from './Scrapers/ScrapDefault';
import { ScrapeFE21 } from './Scrapers/ScrapFE21';
import { ScrapePrimark } from './Scrapers/ScrapPrimark';
import { ScrapeBoohoo } from './Scrapers/ScrapBoohoo';
import { ArticleWebObject } from "../article/web/article.web.model";

export { axios, cheerio, puppeteer };
export const scrapableSites = [
  'https://www.nike.com',
  'https://www.veja-store.com',
  'https://m.shein.com',
  'https://fr.shein.com',
  'https://eur.shein.com',
  'https://us.shein.com',
  'https://www.asos.com',
  'https://shop.mango.com',
  'https://www.uniqlo.com',
  'https://www.forever21.com',
  'https://www.primark.com',
  'https://fr.boohoo.com'
];

export function convertImageUrlToBase64(url): Promise<string> {
  return new Promise((resolve, reject) => {
    request.get({url, encoding: null}, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }
      if (response.statusCode !== 200) {
        reject(`Failed to fetch image, status code: ${response.statusCode}`);
        return;
      }
      const base64String = Buffer.from(body).toString('base64');
      resolve(base64String);
    });
  });
}

type ScrapeFunction = (url: string) => Promise<any>;

interface SiteScraperMap {
  [site: string]: ScrapeFunction;
}

const siteScrapers: SiteScraperMap = {
  'https://www.nike.com': ScrapeNike,
  'https://www.veja-store.com': ScrapeVeja,
  'https://m.shein.com': ScrapeShein,
  'https://fr.shein.com': ScrapeShein,
  'https://eur.shein.com': ScrapeShein,
  'https://us.shein.com': ScrapeShein,
  'https://www.asos.com': ScrapeAsos,
  'https://shop.mango.com': ScrapeMango,
  'https://www.uniqlo.com': ScrapeUniqlo,
  'https://www.forever21.com': ScrapeFE21,
  'https://www.primark.com': ScrapePrimark,
  'https://fr.boohoo.com': ScrapeBoohoo,
};

export interface ClothingItem {
  name: string;
  url: string;
  url_picture: string;
  brand: string;
  country: { name: string }[];
  transport: { name: string }[];
  material: { name: string; percent: number }[];
  color: { name: string; percent: number }[];
  price: number;
  type: string;
}

export function findSimilarWords(
  wordList: string[],
  inputString: string,
): string[] {
  const result: string[] = [];

  wordList.forEach((word) => {
    const lowercaseWord = word.toLowerCase();
    const lowercaseInput = inputString.toLowerCase();
    if (
      lowercaseInput.includes(lowercaseWord) ||
      lowercaseWord.includes(lowercaseInput)
    ) {
      result.push(word);
    }
  });

  return result;
}

export function findMatchingMaterials(
  inputString: string,
): { name: string; percent: number }[] {

  const result: { name: string; percent: number }[] = [];

  materialList.forEach((material) => {
    const lowercaseMaterial = material.toLowerCase();
    const lowercaseInput = inputString.toLowerCase();

    if (
      lowercaseInput.includes(lowercaseMaterial) ||
      lowercaseMaterial.includes(lowercaseInput)
    ) {
      result.push({ name: material, percent: 100 });
    }
  });

  if (result.length === 0) {
    result.push({ name: inputString, percent: 100 });
  }

  return result;
}

export function colorsArrayToRGB(
  colors: string[],
): { rgb: number[]; percent: number }[] {
  const totalColors = colors.length;
  const percent = totalColors > 0 ? 100 / totalColors : 0;
  const colorArray = colors.map((color) => {
    const lowerCaseColor = color.toLowerCase();
    if (colorMap.hasOwnProperty(lowerCaseColor)) {
      return { rgb: colorMap[lowerCaseColor], percent };
    }
    return null;
  });
  if (colorArray.length == 0) return null;
  return colorArray;
}

const userAgent = 'LocalShirtScraper (+localshirt_2025@labeip.epitech.eu)';

@Injectable()
export class ScraperService {
  async CheckRobot(url: string, siteIndex: number): Promise<boolean> {
    const isAllowed = await IsPathAllowed(
      scrapableSites[siteIndex],
      userAgent,
      url,
    );

    if (isAllowed) {
      console.log('All good, have fun crawling');
      return true;
    } else {
      console.error(
        `Crawling ${url} is not allowed according to the site's robots.txt`,
      );
      return false;
    }
  }

  getSimilarSiteIndex(url: string): number {
    for (let i = 0; i < scrapableSites.length; i++) {
      if (url.includes(scrapableSites[i])) {
        return i;
      }
    }
    return -1;
  }

  async ScrapeSite(url: string): Promise<ArticleWebObject> {
    const siteIndex = this.getSimilarSiteIndex(url);

    if (siteIndex === -1) {
      console.error('\nError with site\n');
      return null;
    }

    if (siteIndex != 8) {
      if (!(await this.CheckRobot(url, siteIndex))) {
        return;
      }
      const crawlDelay = await GetCrawlDelay(
        scrapableSites[siteIndex],
        userAgent,
      );
      if (crawlDelay !== undefined) {
        await new Promise((resolve) => setTimeout(resolve, crawlDelay * 1000));
      }
    }

    let article: ArticleWebObject;

    const scrapeFunction = siteScrapers[scrapableSites[siteIndex]];
    if (scrapeFunction) {
      article = await scrapeFunction(url);
    } else {
      await ScrapDefault(url);
      console.error("\nThere was an error with the site, can't find scraper for it");
    }
    console.log('\n\nDONE - SCRAPED\n\n');
    return article;
  }
}