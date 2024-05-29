import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import axios from 'axios';
import { clothingColorList } from '../constants/colorsConstant';
import { clothingTypeList } from '../constants/clothingTypeConstant';
export { clothingColorList, clothingTypeList };
import { ArticleWebObject } from "../article/web/article.web.model";
export { axios, cheerio, puppeteer };
export declare const scrapableSites: string[];
export declare function convertImageUrlToBase64(url: any): Promise<string>;
export interface ClothingItem {
    name: string;
    url: string;
    url_picture: string;
    brand: string;
    country: {
        name: string;
    }[];
    transport: {
        name: string;
    }[];
    material: {
        name: string;
        percent: number;
    }[];
    color: {
        name: string;
        percent: number;
    }[];
    price: number;
    type: string;
}
export declare function findSimilarWords(wordList: string[], inputString: string): string[];
export declare function findMatchingMaterials(inputString: string): {
    name: string;
    percent: number;
}[];
export declare function colorsArrayToRGB(colors: string[]): {
    rgb: number[];
    percent: number;
}[];
export declare class ScraperService {
    CheckRobot(url: string, siteIndex: number): Promise<boolean>;
    getSimilarSiteIndex(url: string): number;
    ScrapeSite(url: string): Promise<ArticleWebObject>;
}
