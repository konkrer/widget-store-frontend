/** ProductDetail tests */
import { act, fireEvent } from '@testing-library/react';

// local imports
import { renderWithStore } from '../../helpers/testHelpers';
import { testStore } from '../../redux/store/reduxStore';
import ProductDetail from './ProductDetail';
import resetCart from '../../redux/actions/cart/resetCart';
import { TEST_DATA, populateTestDataHook } from '../../helpers/testConfig';

const axios = require('axios');
jest.mock('axios');

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
});

beforeEach(() => {
  axios.mockResolvedValue({
    data: {
      product: TEST_DATA.product,
    },
  });
});

afterEach(() => {
  jest.resetAllMocks();
  testStore.dispatch(resetCart());
});

test('renders ProductDetail', async () => {
  await act(async () => {
    renderWithStore(<ProductDetail />);
  });
});

test('ProductDetail snapshot', async () => {
  let asFragment;
  await act(async () => {
    const resp = renderWithStore(<ProductDetail />);
    asFragment = resp.asFragment;
  });
  expect(asFragment()).toMatchSnapshot();
});

test('Quantity input in document', async () => {
  let getByLabelText;
  await act(async () => {
    const resp = renderWithStore(<ProductDetail />);
    getByLabelText = resp.getByLabelText;
  });
  // test quantity input present with value of '1'
  const quantityInput = getByLabelText('Quantity');
  expect(quantityInput).toBeInTheDocument();
  expect(quantityInput.value).toBe('1');
});

test('Add to cart adds to store.cart data', async () => {
  let getByText;
  await act(async () => {
    const resp = renderWithStore(<ProductDetail />);
    getByText = resp.getByText;
  });
  // click add to cart button
  const addBtn = getByText('Add To Cart');
  act(() => {
    fireEvent.click(addBtn);
  });
  // test item data in store.cart
  const cart = testStore.getState().cart;
  expect(cart.items).toHaveProperty('1');
  expect(cart.items[1].quantity).toBe(1);
  expect(cart.items[1].price).toBe('400.40');
});

test('Add to cart can add multiple quantity to store.cart data', async () => {
  let getByText, getByLabelText;
  await act(async () => {
    const resp = renderWithStore(<ProductDetail />);
    getByText = resp.getByText;
    getByLabelText = resp.getByLabelText;
  });
  // set item quantity to add to cart to "3"
  const quantityInput = getByLabelText('Quantity');
  fireEvent.change(quantityInput, { target: { value: '3' } });
  // add to cart
  const addBtn = getByText('Add To Cart');
  act(() => {
    fireEvent.click(addBtn);
  });
  // check store.cart item quantity
  const cart = testStore.getState().cart;
  expect(cart.items).toHaveProperty('1');
  expect(cart.items[1].quantity).toEqual(3);
});
