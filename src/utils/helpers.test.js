import { getPathRoot, animateVariant } from './helpers';

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

describe('animateVariant', () => {
  const setterFunct = jest.fn();
  const callback = jest.fn();

  test('should change state and call callback after delay', async () => {
    animateVariant(setterFunct, 10, callback, ['turkey']);

    expect(setterFunct.mock.calls.length).toBe(1);
    expect(setterFunct.mock.calls[0][0]()).toBe('active');
    expect(callback.mock.calls.length).toBe(0);

    await new Promise(res => setTimeout(res, 15));

    expect(setterFunct.mock.calls.length).toBe(2);
    expect(setterFunct.mock.calls[1][0]).toBe('default');
    expect(callback.mock.calls.length).toBe(1);
    expect(callback.mock.calls[0][0]).toBe('turkey');
  });
});
