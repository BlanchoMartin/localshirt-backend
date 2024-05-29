import { ScrapeFE21 } from './ScrapFE21';

describe('ScrapeFE21', () => {
  it('FE21: should scrape and validate data from a valid URL', async () => {
    const url =
      'https://www.forever21.com/us/2000499650.html?dwvar_2000499650_color=01';
    const result = await ScrapeFE21(url);

    expect(result).toBeDefined();

    expect(result.name).toEqual('Faux Leather Drop-Sleeve Shirt');
    expect(result.url).toEqual(url);
    expect(result.picture_data).toEqual({
      color: [
        {
          rgb: [0, 0, 0],
          percent: 100,
        }
      ],
      type: 'shirt',
    });
    expect(result.brand).toEqual('Forever 21');
    expect(result.price).toEqual(39.99);
    expect(result.country).toEqual([]);
    expect(result.material).toEqual([
      {
        name: 'Polyester',
        percent: 100,
      },
      {
        name: 'Polyurethane',
        percent: 100,
      },
    ]);
    expect(result.transport).toEqual([]);
  }, 20000);
});
