import { ScrapeUniqlo } from './ScrapUniqlo';

describe('ScrapeUniqlo', () => {
  it('Uniqlo: should scrape and validate data from a valid URL', async () => {
    const url =
      'https://www.uniqlo.com/fr/fr/product/doudoune-epaisse-449677.html';
    const result = await ScrapeUniqlo(url);

    expect(result).toBeDefined();

    expect(result.name).toEqual('Doudoune épaisse');
    expect(result.url).toEqual(url);
    expect(result.picture_data).toEqual({
      color: [
        {
          rgb: [0, 0, 255],
          percent: 50,
        },
        {
          rgb: [0, 0, 128],
          percent: 50,
        },
      ],
      type: 'Doudoune',
    });
    expect(result.brand).toEqual('Uniqlo');
    expect(result.price).toEqual(29.9);
    expect(result.country).toEqual([]);
    expect(result.material).toEqual([
      {
        name: 'Duvet',
        percent: 100,
      },
      {
        name: 'Plume',
        percent: 100,
      },
      {
        name: 'Plumes',
        percent: 100,
      },
    ]);
    expect(result.transport).toEqual([]);
  }, 20000);
});
