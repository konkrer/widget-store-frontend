import { act, fireEvent, getByLabelText } from '@testing-library/react';
import axios from 'axios';

// local imports
import { renderWithStore } from '../../utils/testHelpers';
import { TEST_DATA, populateTestDataHook } from '../../utils/testConfig';
import { testStore } from '../../redux/store/reduxStore';
import login from '../../redux/actions/user/login';
import logout from '../../redux/actions/user/logout';
import addProduct from '../../redux/actions/cart/addProduct';
import resetCart from '../../redux/actions/cart/resetCart';
import CheckoutForms from './CheckoutForms';

jest.mock('axios');
const setOrderData = jest.fn();
const setDisabled = jest.fn();

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
});

beforeEach(() => {
  testStore.dispatch(addProduct(TEST_DATA.product));
});

afterEach(() => {
  jest.resetAllMocks();
  testStore.dispatch(logout());
  testStore.dispatch(resetCart());
});

test('renders CheckoutForms', () => {
  renderWithStore(
    <CheckoutForms
      orderData={{}}
      setOrderData={setOrderData}
      setDisabled={setDisabled}
    />
  );
});

test('orderdata.shipping set to null on customer data', async () => {
  // log in user
  testStore.dispatch(login({ username: 'test_user' }, 'token'));
  // mock user profile response
  axios.mockResolvedValue(TEST_DATA.userProfileData);

  let getByRole;
  await act(async () => {
    const resp = renderWithStore(
      <CheckoutForms
        orderData={{ shipping: false }}
        setOrderData={setOrderData}
        setDisabled={setDisabled}
      />
    );
    getByRole = resp.getByRole;
  });
  // click next
  const nextBtn = getByRole('button', { name: /next/i });
  await act(async () => {
    fireEvent.click(nextBtn);
  });
  // expect shipping set null
  expect(setOrderData.mock.calls.length).toBe(1);
  const orderData = setOrderData.mock.calls[0][0]({});
  expect(orderData).toHaveProperty('shipping');
  expect(orderData.shipping).toBeNull();
});

test('shows PaymentForm when orderData.shipping data', async () => {
  // log in user
  testStore.dispatch(login({ username: 'test_user' }, 'token'));
  // mock user profile response
  axios.mockResolvedValue(TEST_DATA.userProfileData);

  let getByRole;
  await act(async () => {
    const resp = renderWithStore(
      <CheckoutForms
        orderData={{
          shipping: { details: { name: 'ups', cost: '15.55' } },
          shippingAddress: null,
          tax: '0.00',
          total: '49.72',
          customer: TEST_DATA.CustomerInfoFormsValues,
        }}
        setOrderData={setOrderData}
        setDisabled={setDisabled}
      />
    );
    getByRole = resp.getByRole;
  });
  // will fail if payment form not rendered
  getByRole('button', { name: /place order/i });
});
