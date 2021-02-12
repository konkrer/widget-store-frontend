import { getPathRoot } from './helpers';

describe('getPathRoot', () => {
  test('should return "root" of the path', () => {
    const url = '/shop/products/388';
    const root = getPathRoot(url);
    expect(root).toBe('/shop');
  });

  test('should return "root" of empty path', () => {
    const url = '/';
    const root = getPathRoot(url);
    expect(root).toBe('/');
  });
});
