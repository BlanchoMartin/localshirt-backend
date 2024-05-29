import {
  axios,
  cheerio,
  clothingColorList,
  clothingTypeList,
  colorsArrayToRGB,
  findMatchingMaterials,
  findSimilarWords,
} from '../scraper.service';
import {ArticleWebObject} from "../../article/web/article.web.model";


export async function ScrapeVeja(url: string): Promise<ArticleWebObject> {
  const scrapedArticleData: ArticleWebObject = new ArticleWebObject();

  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const name = $("span.base[itemprop='name']").text().trim();
  const price = $('span.price').text().trim();
  const size = $('.swatch-attribute-selected-option').html();

  const descriptionProduit = $('.product.attribute.description');
  const descriptionProduitHTML = descriptionProduit.html();
  const descriptionLines = (descriptionProduitHTML as string).split('<br>');
  const descriptionData: Record<string, string> = {};

  descriptionLines.forEach((line) => {
    const keyValue = line.split(':');
    if (keyValue.length === 2) {
      const key = keyValue[0].trim().replace(/<[^>]*>/g, '');
      const value = keyValue[1].trim().replace(/<[^>]*>/g, '');
      descriptionData[key] = value;
    } else {
      const temp = keyValue[0].trim().replace(/<[^>]*>/g, '');
      descriptionData[temp] = temp;
    }
  });

  let origin = 'Brézil';
  for (const key in descriptionData) {
    if (descriptionData.hasOwnProperty(key)) {
      const value = descriptionData[key];
      if (value.startsWith('Fabriqué au ')) {
        origin = value.substring('Fabriqué au '.length);
      }
    }
  }

  const descrptionDataStr = Object.entries(descriptionData)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  scrapedArticleData.name = name;
  scrapedArticleData.url = url;
  scrapedArticleData.image = '';
  scrapedArticleData.brand = 'Veja';
  scrapedArticleData.price = parseFloat(price.replace(',', '.'));
  scrapedArticleData.country = [{ name: origin }];
  scrapedArticleData.material = findMatchingMaterials(descrptionDataStr);
  scrapedArticleData.transport = [];
  const articleJsonString = JSON.stringify(scrapedArticleData, null, 2);
  console.log(articleJsonString);
  return scrapedArticleData;
}
