import { ScrapePrimark } from './ScrapPrimark';

describe('ScrapePrimark', () => {
  it('Primark: should scrape and validate data from a valid URL', async () => {
    const url =
      'https://www.primark.com/fr-fr/p/sweat-a-capuche-homme-les-simpson-homer-buisson-vert-991076717414';
    const result = await ScrapePrimark(url);

    expect(result).toBeDefined();

    expect(result.name).toEqual('Sweat à capuche homme Les Simpson Homer buisson');
    expect(result.url).toEqual(url);
    expect(result.picture_data).toEqual({
      color: [
        {
          rgb: [0, 128, 0],
          percent: 100,
        }
      ],
      type: 'Sweat à capuche',
    });
    expect(result.brand).toEqual('Primark');
    expect(result.price).toEqual(26);
    expect(result.country).toEqual([]);
    expect(result.material).toEqual([
      {
        name: 'Polyester',
        percent: 100,
      }
    ]);
    expect(result.transport).toEqual([]);
  }, 20000);
});
