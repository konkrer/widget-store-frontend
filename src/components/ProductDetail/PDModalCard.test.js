/** PDModalCard tests */
import { act, fireEvent, queryByTestId } from '@testing-library/react';

// local imports
import PDModalCard from './PDModalCard';
import resetCart from '../../redux/actions/cart/resetCart';
import { renderWithStore } from '../../utils/testHelpers';
import { testStore } from '../../redux/store/reduxStore';
import { TEST_DATA, populateTestDataHook } from '../../utils/testConfig';

const handleClose = jest.fn();

// mock useHistory
const mockUseHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockUseHistoryPush,
  }),
}));

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
});

beforeEach(() => {});

afterEach(() => {
  //   jest.resetAllMocks();
  testStore.dispatch(resetCart());
});

test('renders PDModalCard', async () => {
  await act(async () => {
    renderWithStore(
      <PDModalCard handleClose={handleClose} product={TEST_DATA.product} />
    );
  });
});

test('PDModalCard snapshot', async () => {
  let asFragment;
  await act(async () => {
    const resp = renderWithStore(
      <PDModalCard handleClose={handleClose} product={TEST_DATA.product} />
    );
    asFragment = resp.asFragment;
  });
  expect(asFragment()).toMatchSnapshot();
});

test('Quantity input in document', async () => {
  let getByLabelText;
  await act(async () => {
    const resp = renderWithStore(
      <PDModalCard handleClose={handleClose} product={TEST_DATA.product} />
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
      <PDModalCard handleClose={handleClose} product={TEST_DATA.product} />
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
  expect(cart.items).toHaveProperty('1');
  expect(cart.items[1].quantity).toBe(1);
  expect(cart.items[1].price).toBe('400.40');
});

test('Add to cart can add multiple quantity to store.cart data', async () => {
  let getByText, getByLabelText;
  await act(async () => {
    const resp = renderWithStore(
      <PDModalCard handleClose={handleClose} product={TEST_DATA.product} />
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
  expect(cart.items).toHaveProperty('1');
  expect(cart.items[1].quantity).toEqual(3);
});

test('disabled flag disables adding product to cart', async () => {
  let getByText;
  await act(async () => {
    const resp = renderWithStore(
      <PDModalCard
        handleClose={handleClose}
        product={TEST_DATA.product}
        disabled
      />
    );
    getByText = resp.getByText;
  });
  // add to cart
  const addBtn = getByText('Add To Cart');
  act(() => {
    fireEvent.click(addBtn);
  });
  // check store.cart item quantity
  const cart = testStore.getState().cart;
  expect(cart.items).not.toHaveProperty('1');
  expect(cart.numCartItems).toEqual(0);
});

test('clicking cart calls history push /cart', async () => {
  let getByRole;
  await act(async () => {
    const resp = renderWithStore(
      <PDModalCard handleClose={handleClose} product={TEST_DATA.product} />
    );
    getByRole = resp.getByRole;
  });
  const goToCartBtn = getByRole('button', { name: /go to cart/i });
  act(() => {
    fireEvent.click(goToCartBtn);
  });
  expect(mockUseHistoryPush.mock.calls.length).toBe(1);
  expect(mockUseHistoryPush.mock.calls[0][0]).toBe('//cart');
});

test("clicking cart when disabled doesn't calls history push", async () => {
  let getByRole;
  await act(async () => {
    const resp = renderWithStore(
      <PDModalCard
        handleClose={handleClose}
        product={TEST_DATA.product}
        disabled
      />
    );
    getByRole = resp.getByRole;
  });
  const goToCartBtn = getByRole('button', { name: /go to cart/i });
  act(() => {
    fireEvent.click(goToCartBtn);
  });
  expect(mockUseHistoryPush.mock.calls.length).toBe(0);
});

test('normally returns ModalCard in html', async () => {
  let getByTestId;
  await act(async () => {
    const resp = renderWithStore(
      <PDModalCard handleClose={handleClose} product={TEST_DATA.product} />
    );
    getByTestId = resp.getByTestId;
  });
  const modalCard = getByTestId('ModalCard');
  expect(modalCard).toBeInTheDocument();
});

test('does not return ModalCard w/ innerContentOnly true', async () => {
  let queryByTestId;
  await act(async () => {
    const resp = renderWithStore(
      <PDModalCard
        handleClose={handleClose}
        product={TEST_DATA.product}
        innerContentOnly
      />
    );
    queryByTestId = resp.queryByTestId;
  });
  const modalCard = queryByTestId('ModalCard');
  expect(modalCard).not.toBeInTheDocument();
});
