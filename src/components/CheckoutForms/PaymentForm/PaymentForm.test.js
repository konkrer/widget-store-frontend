import { act, fireEvent } from '@testing-library/react';
import axios from 'axios';

// local imports
import { testStore } from '../../../redux/store/reduxStore';
import addProduct from '../../../redux/actions/cart/addProduct';
import { TEST_DATA, populateTestDataHook } from '../../../utils/testConfig';
import { renderWithStore } from '../../../utils/testHelpers';
import PaymentForm from './PaymentForm';

const goTo2 = jest.fn();
const mockRequestPaymentMethod = jest.fn();
const mockUseHistoryReplace = jest.fn();

jest.mock('braintree-web-drop-in', () => ({
  ...jest.requireActual('braintree-web-drop-in'),
  create: async () => {
    return { requestPaymentMethod: mockRequestPaymentMethod };
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockUseHistoryReplace,
  }),
}));

jest.mock('axios');

let orderData;

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
  testStore.dispatch(addProduct({ ...TEST_DATA.product2, quantity: 1 }));

  orderData = {
    shipping: { details: { name: 'ups', cost: '15.55' } },
    shippingAddress: null,
    tax: '0.00',
    total: '49.72',
    customer: TEST_DATA.CustomerInfoFormsValues,
  };
});

afterEach(() => {
  jest.resetAllMocks();
});

test('PaymentForm form renders', async () => {
  let getByText;
  await act(async () => {
    const { getByText: gbt } = renderWithStore(
      <PaymentForm orderData={orderData} goTo2={goTo2} />
    );
    getByText = gbt;
    // wait for timeout to create dropin
    await new Promise(res => setTimeout(res, 950));
  });

  // will fail if payment form not rendered
  getByText(/customer info/i);
  getByText(/shipping address/i);
  getByText(/shipping method/i);
});

test('Place order button calls requestPayment method', async () => {
  await act(async () => {
    const { getByTestId, getByRole } = renderWithStore(
      <PaymentForm orderData={orderData} goTo2={goTo2} />
    );

    // wait for timeout to create dropin
    await new Promise(res => setTimeout(res, 950));

    expect(mockRequestPaymentMethod).not.toHaveBeenCalled();

    // click payDiv
    const payDiv = getByTestId('dropin-container');
    fireEvent.click(payDiv);

    // click place order
    const placeOrderButton = getByRole('button', { name: /place order/i });
    fireEvent.click(placeOrderButton);

    expect(mockRequestPaymentMethod).toHaveBeenCalled();
    expect(mockRequestPaymentMethod.mock.calls.length).toBe(1);
  });
});

test('requestPayment returns funct that show alert if error', async () => {
  await act(async () => {
    const { getByTestId, getByRole } = renderWithStore(
      <PaymentForm orderData={orderData} goTo2={goTo2} />
    );

    // wait for timeout to create dropin
    await new Promise(res => setTimeout(res, 950));

    // click payDiv
    const payDiv = getByTestId('dropin-container');
    fireEvent.click(payDiv);
    // click place order
    const placeOrderButton = getByRole('button', { name: /place order/i });
    fireEvent.click(placeOrderButton);

    // call the async funct that mockRequestPaymentMethod was called with
    // passing an error as first argument should show alert w/ message
    const asyncFunct = mockRequestPaymentMethod.mock.calls[0][0];
    asyncFunct({ message: 'bad error' });

    // expect alert with error message
    let errorAlert = getByRole('alert', { name: /error/i });
    expect(errorAlert.textContent).toBe('bad error');

    // if error msg is as below text
    asyncFunct({ message: 'No payment method is available.' });
    // expect alert with following text
    expect(errorAlert.textContent).toBe('Please provide payment information');
  });
});

test('requestPayment returns funct that calls /orders "POST" if no error', async () => {
  axios.mockResolvedValue({ data: { order: { order_id: 10 } } });

  await act(async () => {
    const { getByTestId, getByRole } = renderWithStore(
      <PaymentForm orderData={orderData} goTo2={goTo2} />
    );

    // wait for timeout to create dropin
    await new Promise(res => setTimeout(res, 950));

    // click payDiv
    const payDiv = getByTestId('dropin-container');
    fireEvent.click(payDiv);
    // click place order
    const placeOrderButton = getByRole('button', { name: /place order/i });
    fireEvent.click(placeOrderButton);

    // call the async funct that mockRequestPaymentMethod was called with
    // passing an error as first argument should show alert w/ message
    const asyncFunct = mockRequestPaymentMethod.mock.calls[0][0];
    asyncFunct(null, { nonce: 'tempNonce' });
  });

  // expect axios to have been called
  expect(axios.mock.calls.length).toBe(1);
  expect(axios.mock.calls[0][0].url).toBe('/orders');
  expect(axios.mock.calls[0][0].method).toBe('post');
  expect(axios.mock.calls[0][0].data.nonce).toBe('tempNonce');
  expect(axios.mock.calls[0][0].data.orderData).toEqual(orderData);
  expect(axios.mock.calls[0][0].data.cart).toEqual(TEST_DATA.cart);

  // expect history replace "/order-success"
  expect(mockUseHistoryReplace).toHaveBeenCalled();
  expect(mockUseHistoryReplace.mock.calls[0][0]).toBe('/order-success/10');
});

test('PaymentForm shows axios error', async () => {
  axios.mockResolvedValue({
    error: { response: { data: { message: 'bad error' } } },
  });

  let getByRole_;
  await act(async () => {
    const { getByTestId, getByRole } = renderWithStore(
      <PaymentForm orderData={orderData} goTo2={goTo2} />
    );
    getByRole_ = getByRole;
    // wait for timeout to create dropin
    await new Promise(res => setTimeout(res, 950));

    // click payDiv
    const payDiv = getByTestId('dropin-container');
    fireEvent.click(payDiv);
    // click place order
    const placeOrderButton = getByRole('button', { name: /place order/i });
    fireEvent.click(placeOrderButton);

    // call the async funct that mockRequestPaymentMethod was called with
    // passing an error as first argument should show alert w/ message
    const asyncFunct = mockRequestPaymentMethod.mock.calls[0][0];
    asyncFunct(null, { nonce: 'tempNonce' });
  });

  // expect alert with error message
  const errorAlert = getByRole_('alert', { name: /error/i });
  expect(errorAlert.textContent).toBe('bad error');
});
