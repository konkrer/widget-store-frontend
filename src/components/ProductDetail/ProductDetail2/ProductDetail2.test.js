/** ProductDetail2 tests */
import { act, fireEvent } from '@testing-library/react';

// local imports
import ProductDetail2 from './ProductDetail2';
import resetCart from '../../../redux/actions/cart/resetCart';
import { renderWithStore } from '../../../utils/testHelpers';
import { testStore } from '../../../redux/store/reduxStore';
import { TEST_DATA, populateTestDataHook } from '../../../utils/testConfig';

const axios = require('axios');
jest.mock('axios');

// mock useHistory
let mockUseHistoryReplace = jest.fn();
let mockUseHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockUseHistoryReplace,
    push: mockUseHistoryPush,
  }),
}));

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

test('renders ProductDetail2', async () => {
  await act(async () => {
    renderWithStore(<ProductDetail2 />);
  });
});

test('ProductDetail2 snapshot', async () => {
  let asFragment;
  await act(async () => {
    const resp = renderWithStore(<ProductDetail2 />);
    asFragment = resp.asFragment;
  });
  expect(asFragment()).toMatchSnapshot();
});

test('Quantity input in document', async () => {
  let getByLabelText;
  await act(async () => {
    const resp = renderWithStore(<ProductDetail2 />);
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
    const resp = renderWithStore(<ProductDetail2 />);
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
    const resp = renderWithStore(<ProductDetail2 />);
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

test('closing modal ok', async () => {
  let getByRole;
  await act(async () => {
    const resp = renderWithStore(<ProductDetail2 />);
    getByRole = resp.getByRole;
  });
  const cancelButton = getByRole('button', { name: /cancel/i });
  act(() => {
    fireEvent.click(cancelButton);
  });
  // await delay to allow animation then page url change
  await new Promise(res => setTimeout(res, 500));
  expect(mockUseHistoryPush.mock.calls.length).toBe(1);
  expect(mockUseHistoryPush.mock.calls[0][0]).toBe('/');
});

test('API error returns null', async () => {
  axios.mockImplementation(() => {
    throw new Error();
  });
  let queryByRole;
  await act(async () => {
    const resp = renderWithStore(<ProductDetail2 />);
    queryByRole = resp.queryByRole;
  });
  const cancelButton = queryByRole('button', { name: /cancel/i });
  expect(cancelButton).not.toBeInTheDocument();
  expect(mockUseHistoryReplace.mock.calls.length).toBe(1);
  expect(mockUseHistoryReplace.mock.calls[0][0]).toBe('/');
});
