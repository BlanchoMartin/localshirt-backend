import { ScrapeShein } from './ScrapShein';

describe('ScrapeShein', () => {
  it('Shein: should scrape and validate data from a valid URL', async () => {
    const url =
      'https://fr.shein.com/Men-Ombre-Japanese-Letter-Graphic-Drop-Shoulder-Kimono-Without-Tee-p-12704740-cat-1977.html?onelink=4/2uwrgdspfht9&requestId=383698273566720139&url_from=fradplasm2301038845094447S&cid=20345937302&setid=151055854236&adid=664875368590&pf=GOOGLE&gclid=Cj0KCQjw6KunBhDxARIsAKFUGs-_k50dTOtH2xWLOTs1FAl9CxaqEc5X4mSrh3r1uU4ZUDCGr9aGeLwaAg43EALw_wcB';
    const result = await ScrapeShein(url);

    expect(result).toBeDefined();

    expect(result.name).toEqual('Manfinity Hypemode Homme Kimono dégradé lettre japonaise (sans t-shirt) ');
    expect(result.url).toEqual(url);
    expect(result.picture_data).toEqual({
      color: [
        {
          rgb: [0, 0, 0],
          percent: 50,
        },
        {
          rgb: [255, 255, 255],
          percent: 50,
        },
      ],
      type: 'shirt',
    });
    expect(result.brand).toEqual('Shein');
    expect(result.price).toEqual(11.49);
    expect(result.country).toEqual([
      { name: 'Chine' },
      { name: 'Chine' },
      { name: 'Chine' },
    ]);
    expect(result.material).toEqual([
      {
        name: 'Polyester',
        percent: 100,
      },
    ]);
    expect(result.transport).toEqual([]);
  }, 60000);
});
