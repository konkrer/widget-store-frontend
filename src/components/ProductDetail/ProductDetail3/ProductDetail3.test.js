/** ProductDetail3 tests */

import { act, fireEvent } from '@testing-library/react';

// local imports
import { renderWithStore } from '../../../utils/testHelpers';
import { testStore } from '../../../redux/store/reduxStore';
import ProductDetail3 from './ProductDetail3';
import addProduct from '../../../redux/actions/cart/addProduct';
import resetCart from '../../../redux/actions/cart/resetCart';
import { TEST_DATA, populateTestDataHook } from '../../../utils/testConfig';

let setSelectedId;

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
  setSelectedId = jest.fn();
});

beforeEach(() => {
  // ProductDetail3 looks in state.cart.items for modal data
  // Add product data to cart to allow ProductDetail3 to render.
  testStore.dispatch(addProduct({ ...TEST_DATA.product, quantity: 1 }));
});

afterEach(() => {
  testStore.dispatch(resetCart());
  jest.resetAllMocks();
});

test('renders ProductDetail3', async () => {
  await act(async () => {
    renderWithStore(
      <ProductDetail3
        selectedId={TEST_DATA.product.product_id}
        setSelectedId={setSelectedId}
      />
    );
  });
});

test('ProductDetail3 snapshot', async () => {
  let asFragment;
  await act(async () => {
    const resp = renderWithStore(
      <ProductDetail3
        selectedId={TEST_DATA.product.product_id}
        setSelectedId={setSelectedId}
      />
    );
    asFragment = resp.asFragment;
  });
  expect(asFragment()).toMatchSnapshot();
});

test('Quantity input in document', async () => {
  let getByLabelText;
  await act(async () => {
    const resp = renderWithStore(
      <ProductDetail3
        selectedId={TEST_DATA.product.product_id}
        setSelectedId={setSelectedId}
      />
    );
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
    const resp = renderWithStore(
      <ProductDetail3
        selectedId={TEST_DATA.product.product_id}
        setSelectedId={setSelectedId}
      />
    );
    getByText = resp.getByText;
  });
  // click add to cart button
  const addBtn = getByText('Add To Cart');
  act(() => {
    fireEvent.click(addBtn);
  });
  // test item data in store.cart
  const cart = testStore.getState().cart;
  expect(cart.items).toHaveProperty(`${TEST_DATA.product.product_id}`);
  expect(cart.items[`${TEST_DATA.product.product_id}`].quantity).toBe(2);
});

test('Add to cart can add multiple quantity to store.cart data', async () => {
  let getByText, getByLabelText;
  await act(async () => {
    const resp = renderWithStore(
      <ProductDetail3
        selectedId={TEST_DATA.product.product_id}
        setSelectedId={setSelectedId}
      />
    );
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
  expect(cart.items).toHaveProperty(`${TEST_DATA.product.product_id}`);
  expect(cart.items[`${TEST_DATA.product.product_id}`].quantity).toEqual(4);
});

test('closing modal sets selectedId null', async () => {
  let getByRole;
  await act(async () => {
    const resp = renderWithStore(
      <ProductDetail3
        selectedId={TEST_DATA.product.product_id}
        setSelectedId={setSelectedId}
      />
    );
    getByRole = resp.getByRole;
  });
  const cancelButton = getByRole('button', { name: /cancel/i });
  fireEvent.click(cancelButton);

  expect(setSelectedId.mock.calls.length).toBe(1);
  expect(setSelectedId.mock.calls[0][0]).toBeNull();
});
