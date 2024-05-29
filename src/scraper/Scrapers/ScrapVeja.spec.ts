import { ScrapeVeja } from './ScrapVeja';

describe('ScrapeVeja', () => {
  it('Veja: should scrape and validate data from a valid URL', async () => {
    const url =
      'https://www.veja-store.com/fr_fr/wata-2-low-canvas-white-pierre-pl0101401a.html';
    const result = await ScrapeVeja(url);

    expect(result).toBeDefined();

    expect(result.name).toEqual('WATA II LOW CANVAS WHITE PIERRE');
    expect(result.url).toEqual(url);
    expect(result.picture_data).toEqual({
      color: [
        {
          rgb: [255, 255, 255],
          percent: 100,
        },
      ],
      type: 'Chaussure',
    });
    expect(result.brand).toEqual('Veja');
    expect(result.price).toEqual(125);
    expect(result.country).toEqual([
      { name: 'Brésil' },
    ]);
    expect(result.material).toEqual([
      {
        name: 'Coton bio',
        percent: 100,
      },
      {
        name: 'Coton',
        percent: 100,
      },
      {
        name: 'Soie',
        percent: 100,
      },
    ]);
    expect(result.transport).toEqual([]);
  }, 20000);
});
