import { testStore } from './reduxStore';
import login from '../actions/user/login';
import logout from '../actions/user/logout';
import addProduct from '../actions/cart/addProduct';
import incrementQuantity from '../actions/cart/incrementQuantity';
import decrementQuantity from '../actions/cart/decrementQuantity';
import resetCart from '../actions/cart/resetCart';

import { TEST_DATA, populateTestDataHook } from '../../helpers/testConfig';

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
});

afterEach(() => {
  testStore.dispatch(resetCart());
});

describe('user reducer', () => {
  test('should allow login and logout', () => {
    // init state null
    let user = testStore.getState().user;
    expect(user.user).toBeNull();
    expect(user.token).toBeNull();

    // add user obj and token string
    testStore.dispatch(login({ user: 'user' }, 'token'));
    // retrieve user obj and token string
    user = testStore.getState().user;
    expect(user.user.user).toBe('user');
    expect(user.token).toBe('token');

    // logout and test data is null
    testStore.dispatch(logout());
    user = testStore.getState().user;
    expect(user.user).toBeNull();
    expect(user.token).toBeNull();
  });
});

describe('cart reducer', () => {
  test('cart empty state', () => {
    const cart = testStore.getState().cart;
    expect(Object.keys(cart.items)).toHaveLength(0);
    expect(cart.subtotal).toBe(0);
    expect(cart.numCartItems).toBe(0);
  });

  test('cart add product', () => {
    // add test product
    testStore.dispatch(addProduct(TEST_DATA.product));
    // test cart data correct
    let cart = testStore.getState().cart;
    expect(Object.keys(cart.items)).toHaveLength(1);
    expect(cart.items).toHaveProperty('1');
    expect(cart.items[1].quantity).toBe(100);
    expect(cart.subtotal).toBe('40040.00');
    expect(cart.numCartItems).toBe(100);

    // add another of same product
    testStore.dispatch(addProduct(TEST_DATA.product));

    // test cart data correct
    cart = testStore.getState().cart;
    expect(Object.keys(cart.items)).toHaveLength(1);
    expect(cart.items).toHaveProperty('1');
    expect(cart.items[1].quantity).toBe(200);
    expect(cart.subtotal).toBe('80080.00');
    expect(cart.numCartItems).toBe(200);

    // add a different product
    testStore.dispatch(addProduct(TEST_DATA.product2));

    // test cart data correct
    cart = testStore.getState().cart;
    expect(Object.keys(cart.items)).toHaveLength(2);
    expect(cart.items).toHaveProperty('2');
    expect(cart.items[2].quantity).toBe(1);
    expect(cart.subtotal).toBe('80114.17');
    expect(cart.numCartItems).toBe(201);
  });

  test('incrementQuantity works as expected', () => {
    // add test product
    testStore.dispatch(addProduct(TEST_DATA.product));
    // increment quantity
    testStore.dispatch(incrementQuantity(TEST_DATA.product.product_id));

    let cart = testStore.getState().cart;
    expect(Object.keys(cart.items)).toHaveLength(1);
    expect(cart.items).toHaveProperty('1');
    expect(cart.items[1].quantity).toBe(101);
    expect(cart.subtotal).toBe('40440.40');
    expect(cart.numCartItems).toBe(101);
  });

  test('decrementQuantity works as expected', () => {
    // add test product
    testStore.dispatch(addProduct(TEST_DATA.product));
    // increment quantity
    testStore.dispatch(decrementQuantity(TEST_DATA.product.product_id));

    let cart = testStore.getState().cart;
    expect(Object.keys(cart.items)).toHaveLength(1);
    expect(cart.items).toHaveProperty('1');
    expect(cart.items[1].quantity).toBe(99);
    expect(cart.subtotal).toBe('39639.60');
    expect(cart.numCartItems).toBe(99);
  });

  test('resetCart works as expected', () => {
    // add test product
    testStore.dispatch(addProduct(TEST_DATA.product));
    // increment quantity
    testStore.dispatch(resetCart());

    let cart = testStore.getState().cart;
    expect(Object.keys(cart.items)).toHaveLength(0);
    expect(cart.items).not.toHaveProperty('1');
    expect(cart.subtotal).toBe(0);
    expect(cart.numCartItems).toBe(0);
  });
});
