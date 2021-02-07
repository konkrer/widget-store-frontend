import { act, fireEvent } from '@testing-library/react';
import axios from 'axios';

// local imports
import { renderWithStore } from '../../../helpers/testHelpers';
import { TEST_DATA, populateTestDataHook } from '../../../helpers/testConfig';
import { testStore } from '../../../redux/store/reduxStore';
import login from '../../../redux/actions/user/login';
import logout from '../../../redux/actions/user/logout';
import addProduct from '../../../redux/actions/cart/addProduct';
import CustomerInfoForms from './CustomerInfoForms';

// mock axios, setOrderData, and goTo2
jest.mock('axios');
const setOrderData = jest.fn();
const goTo1 = jest.fn();
const goTo2 = jest.fn();
const getShippingCosts = jest.fn();
const setCustomerCheckmark = jest.fn();

// label regexs and test values for form inputs testing
const inputs = [
  [/first name/i, 'bob'],
  [/last name/i, 'bobert'],
  [/email/i, 'abc@def.gh'],
  [/street address/i, '123 Hill Ave'],
  [/city/i, 'Big City'],
  [/state/i, 'Texas'],
  [/postal code/i, '55555'],
];

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
  testStore.dispatch(addProduct(TEST_DATA.product));
});

afterEach(() => {
  jest.resetAllMocks();
});

test('CustomerInfoForms should render', () => {
  renderWithStore(
    <CustomerInfoForms
      orderData={{ shipping: false }}
      setOrderData={setOrderData}
      goTo1={goTo1}
      goTo2={goTo2}
      getShippingCosts={getShippingCosts}
      subtotal={TEST_DATA.cart.subtotal}
      setCustomerCheckmark={setCustomerCheckmark}
    />
  );
});

test('CustomerInfoForms snapshot', async () => {
  const { asFragment } = renderWithStore(
    <CustomerInfoForms
      orderData={{ shipping: false }}
      setOrderData={setOrderData}
      goTo1={goTo1}
      goTo2={goTo2}
      getShippingCosts={getShippingCosts}
      subtotal={TEST_DATA.cart.subtotal}
      setCustomerCheckmark={setCustomerCheckmark}
    />
  );
  expect(asFragment()).toMatchSnapshot();
});

test('shoud add customer data to orderData with submit success', async () => {
  const { getAllByLabelText, getByRole } = renderWithStore(
    <CustomerInfoForms
      orderData={{ shipping: false }}
      setOrderData={setOrderData}
      goTo1={goTo1}
      goTo2={goTo2}
      getShippingCosts={getShippingCosts}
      subtotal={TEST_DATA.cart.subtotal}
      setCustomerCheckmark={setCustomerCheckmark}
    />
  );

  // add values to all inputs
  await act(async () => {
    inputs.forEach(async ([re, text]) => {
      const input = getAllByLabelText(re)[0];
      fireEvent.change(input, { target: { value: text } });
    });
  });

  const nextButton = getByRole('button', {
    name: /next/i,
  });
  await act(async () => {
    fireEvent.click(nextButton);
  });
  expect(setOrderData).toHaveBeenCalled();
  expect(getShippingCosts).toHaveBeenCalled();
  expect(getShippingCosts.mock.calls.length).toBe(1);
  expect(getShippingCosts.mock.calls[0][0].shippingAddress.address).toBe(
    '123 Hill Ave'
  );
  expect(getShippingCosts.mock.calls[0][0].shippingAddress.city).toBe(
    'Big City'
  );
  expect(getShippingCosts.mock.calls[0][0].shippingAddress.state).toBe('Texas');
  expect(getShippingCosts.mock.calls[0][0].shippingAddress.postal_code).toBe(
    '55555'
  );

  // call funct that was argument to setOrderData with blank "orderData" object
  const orderData = setOrderData.mock.calls[0][0]({});
  expect(orderData).toHaveProperty('customer');
  expect(orderData.customer.first_name).toBe('bob');
  expect(Object.keys(orderData.customer)).toHaveLength(9);
});

test('shoud auto add customer data if user is signed in', async () => {
  testStore.dispatch(login({ username: 'user' }, 'token'));
  axios.mockResolvedValue(TEST_DATA.userProfileData);

  let getByRole;
  await act(async () => {
    const resp = renderWithStore(
      <CustomerInfoForms
        orderData={{ shipping: false }}
        setOrderData={setOrderData}
        goTo1={goTo1}
        goTo2={goTo2}
        getShippingCosts={getShippingCosts}
        subtotal={TEST_DATA.cart.subtotal}
        setCustomerCheckmark={setCustomerCheckmark}
      />
    );
    getByRole = resp.getByRole;
  });

  const nextButton = getByRole('button', {
    name: /next/i,
  });
  await act(async () => {
    fireEvent.click(nextButton);
  });

  expect(axios).toHaveBeenCalled();
  expect(axios.mock.calls.length).toBe(1);
  expect(axios.mock.calls[0][0].url).toBe('/users/user');
  expect(axios.mock.calls[0][0].method).toBe('get');
  expect(axios.mock.calls[0][0].params._token).toBe('token');

  expect(setOrderData).toHaveBeenCalled();
  expect(setOrderData.mock.calls.length).toBe(1);
  expect(getShippingCosts).toHaveBeenCalled();
  expect(getShippingCosts.mock.calls.length).toBe(1);

  // expect orderData to have been populated
  const orderData = setOrderData.mock.calls[0][0]({});
  expect(orderData).toHaveProperty('customer');
  expect(orderData.customer.first_name).toBe('bob');
  expect(Object.keys(orderData.customer)).toHaveLength(10);

  testStore.dispatch(logout());
});

test('shoud not update orderData with incomplete form', async () => {
  const { getAllByLabelText, getByRole, getByText } = renderWithStore(
    <CustomerInfoForms
      orderData={{ shipping: false }}
      setOrderData={setOrderData}
      goTo1={goTo1}
      goTo2={goTo2}
      getShippingCosts={getShippingCosts}
      subtotal={TEST_DATA.cart.subtotal}
      setCustomerCheckmark={setCustomerCheckmark}
    />
  );

  // choose random index for a required input to skip
  const skip = Math.floor(Math.random() * inputs.length);

  // add values to inputs for all but one random input
  await act(async () => {
    inputs.forEach(async ([re, text], idx) => {
      if (idx === skip) return;
      const input = getAllByLabelText(re)[0];
      fireEvent.change(input, { target: { value: text } });
    });
  });

  const nextButton = getByRole('button', {
    name: /next/i,
  });
  await act(async () => {
    fireEvent.click(nextButton);
  });

  // expect one input on form to show "required"
  const invalidInput = getByText('Required');
  expect(invalidInput).toBeInTheDocument();
});

test('shoud call update profile when user signed in and update checked', async () => {
  testStore.dispatch(login({ username: 'user' }, 'token'));
  axios.mockResolvedValue(TEST_DATA.userProfileData);

  let getByRole;
  await act(async () => {
    const resp = renderWithStore(
      <CustomerInfoForms
        orderData={{ shipping: false }}
        setOrderData={setOrderData}
        goTo1={goTo1}
        goTo2={goTo2}
        getShippingCosts={getShippingCosts}
        subtotal={TEST_DATA.cart.subtotal}
        setCustomerCheckmark={setCustomerCheckmark}
      />
    );
    getByRole = resp.getByRole;
  });

  // click edit info
  await act(async () => {
    const editButton = getByRole('button', { name: 'Edit Customer Info' });
    fireEvent.click(editButton);
  });

  axios.mockResolvedValue({
    data: { ok: 'ok' },
  });

  // update user data
  const updateButton = getByRole('button', {
    name: /Update Customer Info/i,
  });
  await act(async () => {
    fireEvent.click(updateButton);
  });

  expect(axios).toHaveBeenCalled();
  expect(axios.mock.calls.length).toBe(2);
  expect(setOrderData).toHaveBeenCalled();
  // expect(goTo2).not.toHaveBeenCalled();

  expect(axios.mock.calls[1][0].url).toBe('/users/user');
  expect(axios.mock.calls[1][0].method).toBe('patch');
  expect(axios.mock.calls[1][0].params._token).toBe('token');
  expect(axios.mock.calls[1][0].data.first_name).toBe('bob');

  testStore.dispatch(logout());
});

test('shoud show error message with profile update failure', async () => {
  testStore.dispatch(login({ username: 'user' }, 'token'));
  axios.mockResolvedValue(TEST_DATA.userProfileData);

  let getByRole;
  await act(async () => {
    const resp = renderWithStore(
      <CustomerInfoForms
        orderData={{ shipping: false }}
        setOrderData={setOrderData}
        goTo1={goTo1}
        goTo2={goTo2}
        getShippingCosts={getShippingCosts}
        subtotal={TEST_DATA.cart.subtotal}
        setCustomerCheckmark={setCustomerCheckmark}
      />
    );
    getByRole = resp.getByRole;
  });

  // click edit info
  await act(async () => {
    const editButton = getByRole('button', { name: 'Edit Customer Info' });
    fireEvent.click(editButton);
  });

  axios.mockResolvedValue({
    error: { response: { data: { message: 'error message' } } },
  });

  const updateButton = getByRole('button', {
    name: /update customer info/i,
  });
  await act(async () => {
    fireEvent.click(updateButton);
  });

  expect(axios).toHaveBeenCalled();
  expect(axios.mock.calls.length).toBe(2);

  const errorMessage = getByRole('alert');
  expect(errorMessage).toBeInTheDocument();
  expect(errorMessage.textContent).toBe('error message');

  testStore.dispatch(logout());
});
