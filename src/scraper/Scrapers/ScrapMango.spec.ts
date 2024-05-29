import { ScrapeMango } from './ScrapMango';

describe('ScrapeMango', () => {
  it('Mango: should scrape and validate data from a valid URL', async () => {
    const url =
      'https://shop.mango.com/fr/homme/chemises-slim-fit/chemise-slim-fit-en-coton-stretch_57014006.html';
    const result = await ScrapeMango(url);
    expect(result).toBeDefined();

    expect(result.name).toEqual('Chemise slim fit en coton stretch');
    expect(result.url).toEqual(url);
    expect(result.picture_data).toEqual({
      color: [
        {
          rgb: [0, 0, 255],
          percent: 33.333333333333336,
        },
        {
          rgb: [245, 245, 220],
          percent: 33.333333333333336,
        },
        {
          rgb: [245, 245, 220],
          percent: 33.333333333333336,
        },
      ],
      type: 'Chemise',
    });
    expect(result.brand).toEqual('Mango');
    expect(result.price).toEqual(27.99);
    expect(result.country).toEqual([
      { name: ' Bangladesh' }]);
    expect(result.material).toEqual([
      {
        name: 'Coton',
        percent: 100,
      },
      {
        name: 'Elasthanne',
        percent: 100,
      },
    ]);
    expect(result.transport).toEqual([]);
  }, 20000);
});
