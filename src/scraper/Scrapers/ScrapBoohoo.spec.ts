import { ScrapeBoohoo } from './ScrapBoohoo';

describe('ScrapeBoohoo', () => {
  it('Boohoo: should scrape and validate data from a valid URL', async () => {
    const url =
      'https://fr.boohoo.com/grande-taille---jean-cargo-basique-taille-haute/GZZ61553.html';
    const result = await ScrapeBoohoo(url);

    expect(result).toBeDefined();

    expect(result.name).toEqual('Grande taille - Jean cargo basique taille haute');
    expect(result.url).toEqual(url);
    expect(result.picture_data).toEqual({
      color: [
        {
          rgb: [0, 0, 0],
          percent: 100,
        }
      ],
      type: 'Jean',
    });
    expect(result.brand).toEqual('Boohoo');
    expect(result.price).toEqual(29);
    expect(result.country).toEqual([]);
    expect(result.material).toEqual([
      {
        name: 'Coton',
        percent: 100,
      }
    ]);
    expect(result.transport).toEqual([]);
  }, 20000);
});
