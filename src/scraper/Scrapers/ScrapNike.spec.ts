import { ScrapeNike } from './ScrapNike';

describe('ScrapeNike', () => {
  it('NIKE: should scrape and validate data from a valid URL', async () => {
    const url =
      'https://www.nike.com/fr/t/tee-shirt-sportswear-club-pour-G2qXCD/AR4997-686';
    const result = await ScrapeNike(url);

    expect(result).toBeDefined();

    expect(result.name).toEqual('Nike Sportswear Club');
    expect(result.url).toEqual(url);
    expect(result.picture_data).toEqual({
      color: [
        {
          rgb: [255, 182, 193],
          percent: 100,
        },
      ],
      type: 'shirt',
    });
    expect(result.brand).toEqual('Nike');
    expect(result.price).toEqual(17.47);
    expect(result.country).toEqual([
      { name: 'Chine' },
      { name: 'Vietnam' },
    ]);
    expect(result.material).toEqual([
      {
        name: 'Coton',
        percent: 100,
      },
    ]);
    expect(result.transport).toEqual([]);
  }, 20000);
});
