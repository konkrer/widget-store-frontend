/** Cart tests */

import { fireEvent, act } from '@testing-library/react';
import { testStore } from '../../redux/store/reduxStore';

// local imports
import { renderWithStore } from '../../utils/testHelpers';
import addProduct from '../../redux/actions/cart/addProduct';
import resetCart from '../../redux/actions/cart/resetCart';
import { populateTestDataHook, TEST_DATA } from '../../utils/testConfig';
import Cart from './Cart';

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
});

afterEach(() => {
  testStore.dispatch(resetCart());
});

const mockUseHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockUseHistoryPush,
  }),
}));

test('renders Cart', async () => {
  renderWithStore(<Cart />);
});

test('Cart snapshot', async () => {
  const { asFragment } = renderWithStore(<Cart />);
  expect(asFragment()).toMatchSnapshot();
});

test('close button calls history push', async () => {
  const { getByRole } = renderWithStore(<Cart />);

  const closeBtn = getByRole('button', { name: 'close' });

  await act(async () => {
    fireEvent.click(closeBtn);
    // await cart close animation to finish
    await new Promise(res => setTimeout(res, 450));
  });

  expect(mockUseHistoryPush.mock.calls.length).toBe(1);
  // check close goes to path root
  expect(mockUseHistoryPush.mock.calls[0][0]).toBe('/');
});

test("checkout button doesn't call history.push with empty cart", async () => {
  const { getByRole } = renderWithStore(<Cart />);

  const checkoutBtn = getByRole('button', { name: /proceed to checkout/i });

  await act(async () => {
    fireEvent.click(checkoutBtn);
    // await cart close animation to finish
    await new Promise(res => setTimeout(res, 550));
  });

  expect(mockUseHistoryPush.mock.calls.length).toBe(0);
});

test('go to checkout does call history.push when cart has items', async () => {
  testStore.dispatch(addProduct(TEST_DATA.product));

  const { getByRole } = renderWithStore(<Cart />);

  const checkoutBtn = getByRole('button', { name: /proceed to checkout/i });

  await act(async () => {
    fireEvent.click(checkoutBtn);
    // await cart close animation to finish
    await new Promise(res => setTimeout(res, 550));
  });

  expect(mockUseHistoryPush.mock.calls.length).toBe(1);
  expect(mockUseHistoryPush.mock.calls[0][0]).toBe('/checkout');
});
