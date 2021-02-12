import { act, fireEvent } from '@testing-library/react';
import axios from 'axios';

// local imports
import { renderWithStore } from '../../../utils/testHelpers';
import { TEST_DATA, populateTestDataHook } from '../../../utils/testConfig';
import { testStore } from '../../../redux/store/reduxStore';
import login from '../../../redux/actions/user/login';
import logout from '../../../redux/actions/user/logout';
import addProduct from '../../../redux/actions/cart/addProduct';
import CustomerInfoForms from './CustomerInfoForms';
import resetCart from '../../../redux/actions/cart/resetCart';

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
});

beforeEach(() => {
  testStore.dispatch(addProduct(TEST_DATA.product));
});

afterEach(() => {
  jest.resetAllMocks();
  testStore.dispatch(logout());
  testStore.dispatch(resetCart());
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
  testStore.dispatch(login({ username: 'test_user' }, 'token'));
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
  expect(axios.mock.calls[0][0].url).toBe('/users/test_user');
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

test('shoud show "is-invalid" class on all invalid inputs', async () => {
  const {
    getByRole,
    getAllByText,
    getByLabelText,
    getAllByLabelText,
  } = renderWithStore(
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

  // make phone invalid
  const phoneInput = getByLabelText(/phone/i);
  await act(async () => {
    fireEvent.change(phoneInput, { target: { value: '555' } });
  });
  // make address_line2 invalid. first input is on customer address form
  const addLine2 = getAllByLabelText(/address line two/i)[0];
  await act(async () => {
    fireEvent.change(addLine2, { target: { value: '5'.repeat(256) } });
  });

  const nextButton = getByRole('button', {
    name: /next/i,
  });
  await act(async () => {
    fireEvent.click(nextButton);
  });

  // all required inputs show "required"
  const invalidInput = getAllByText('Required');
  expect(invalidInput.length).toBe(inputs.length);

  // test "is-invalid" class is present on all inputs
  // for invalid input sytling (Bootstrap).
});

test('shoud call update profile when user attempts update', async () => {
  testStore.dispatch(login({ username: 'test_user' }, 'token'));
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

  expect(axios.mock.calls[1][0].url).toBe('/users/test_user');
  expect(axios.mock.calls[1][0].method).toBe('patch');
  expect(axios.mock.calls[1][0].params._token).toBe('token');
  expect(axios.mock.calls[1][0].data.first_name).toBe('bob');
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
});

test('should clear cart on logout', async () => {
  // mock signed in user data response for a user profile
  axios.mockResolvedValue(TEST_DATA.userProfileData);
  // make user logged in and product in cart
  testStore.dispatch(login({ username: 'test_user' }, 'token'));

  let cart = testStore.getState().cart;
  expect(cart.numCartItems).toBe(100);

  await act(async () => {
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

  // logout
  await act(async () => {
    testStore.dispatch(logout());
    // await form reset timer
    await new Promise(res => setTimeout(res, 150));
  });

  cart = testStore.getState().cart;
  expect(cart.numCartItems).toBe(0);
});

test('should not clear cart on login', async () => {
  axios.mockResolvedValue(TEST_DATA.userProfileData);
  let cart = testStore.getState().cart;
  expect(cart.numCartItems).toBe(100);

  await act(async () => {
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

  // login
  await act(async () => {
    testStore.dispatch(login({ username: 'test_user' }, 'token'));
    // await form reset timer
    await new Promise(res => setTimeout(res, 150));
  });

  cart = testStore.getState().cart;
  expect(cart.numCartItems).toBe(100);
});

test('edit shipping address updates orderData', async () => {
  axios.mockResolvedValue(TEST_DATA.userProfileData);
  // log in user so shipping address form shows
  testStore.dispatch(login({ username: 'test_user' }, 'token'));

  let getByRole, getAllByLabelText;
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
    getAllByLabelText = resp.getAllByLabelText;
  });

  const editShippingBtn = getByRole('button', { name: /edit shipping info/i });
  fireEvent.click(editShippingBtn);

  await act(async () => {
    const firstName = getAllByLabelText(/first name/i);
    fireEvent.change(firstName[1], { target: { value: 'Henry' } });

    const updateShippingBtn = getByRole('button', {
      name: /update shipping address/i,
    });
    fireEvent.click(updateShippingBtn);
  });

  const orderData = setOrderData.mock.calls[0][0]({});
  expect(orderData).toHaveProperty('shippingAddress');
  expect(orderData.shippingAddress.first_name).toBe('Henry');
});

test('shoud show error message with API failure', async () => {
  axios.mockResolvedValue({
    error: { response: { data: { message: 'error message' } } },
  });
  // log in user
  testStore.dispatch(login({ username: 'test_user' }, 'token'));

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

  expect(axios).toHaveBeenCalled();

  const alert = getByRole('alert');
  expect(alert).toBeInTheDocument();
  expect(alert.textContent).toBe('error message');
});

test('shipping address phone number updates with customer address update', async () => {
  testStore.dispatch(login({ username: 'user' }, 'token'));
  axios.mockResolvedValue(TEST_DATA.userProfileData);

  let getByRole, getByLabelText;
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
    getByLabelText = resp.getByLabelText;
  });

  // update customer phone number info
  fireEvent.click(getByRole('button', { name: /edit customer info/i }));
  await act(async () => {
    fireEvent.change(getByLabelText(/phone number/i), {
      target: { value: '123-456-7890' },
    });
  });
  axios.mockResolvedValue({
    data: { ok: 'ok' },
  });
  await act(async () => {
    fireEvent.click(getByRole('button', { name: /update customer info/i }));
  });

  // check setOrderData was called with function to update shippingAddress phone number
  expect(setOrderData.mock.calls.length).toBe(1);
  // fake a shipping address has already been set in obj passed to setOrderData
  const fakeOrderData = {
    shippingAddress: {},
  };

  const setOrderDataOutput = setOrderData.mock.calls[0][0](fakeOrderData);
  expect(setOrderDataOutput).toHaveProperty('shippingAddress');
  expect(setOrderDataOutput.shippingAddress.phone_number).toBe('123-456-7890');
});

test("clicking next with no items in cart doesn't call setOrderData", async () => {
  testStore.dispatch(resetCart());
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

  await act(async () => {
    fireEvent.click(getByRole('button', { name: /next/i }));
  });

  expect(setOrderData.mock.calls.length).toBe(0);
});

test('skips getShippingCosts when user signed in and shipping null', async () => {
  testStore.dispatch(login({ username: 'user' }, 'token'));
  axios.mockResolvedValue(TEST_DATA.userProfileData);

  let getByRole;
  await act(async () => {
    const resp = renderWithStore(
      <CustomerInfoForms
        orderData={{ shipping: null }}
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

  await act(async () => {
    fireEvent.click(getByRole('button', { name: /next/i }));
  });

  expect(getShippingCosts.mock.calls.length).toBe(0);
});

test("clicking cancel doesn't update user profile", async () => {
  testStore.dispatch(login({ username: 'user' }, 'token'));
  axios.mockResolvedValue(TEST_DATA.userProfileData);

  let getByRole, getAllByRole;
  await act(async () => {
    const resp = renderWithStore(
      <CustomerInfoForms
        orderData={{ shipping: null }}
        setOrderData={setOrderData}
        goTo1={goTo1}
        goTo2={goTo2}
        getShippingCosts={getShippingCosts}
        subtotal={TEST_DATA.cart.subtotal}
        setCustomerCheckmark={setCustomerCheckmark}
      />
    );
    getByRole = resp.getByRole;
    getAllByRole = resp.getAllByRole;
  });

  fireEvent.click(getByRole('button', { name: /edit customer info/i }));
  fireEvent.click(getAllByRole('button', { name: /cancel/i })[0]);

  // expect axios to have been called once to get user profile
  // but not called second time to update profile
  expect(axios.mock.calls.length).toBe(1);
});

test("signed in user doesn't see next btn if not enough address", async () => {
  testStore.dispatch(login({ username: 'user' }, 'token'));
  axios.mockResolvedValue({
    data: {
      user: {
        user_id: 1,
        username: 'widgetLord',
        email: 'foo@gmail.com',
        first_name: null,
        last_name: null,
        address: null,
        address_line2: null,
        city: null,
        state: null,
        postal_code: null,
        phone_number: null,
        avatar_url: null,
        orders: [],
      },
    },
  });

  let queryByRole;
  await act(async () => {
    const resp = renderWithStore(
      <CustomerInfoForms
        orderData={{ shipping: null }}
        setOrderData={setOrderData}
        goTo1={goTo1}
        goTo2={goTo2}
        getShippingCosts={getShippingCosts}
        subtotal={TEST_DATA.cart.subtotal}
        setCustomerCheckmark={setCustomerCheckmark}
      />
    );
    queryByRole = resp.queryByRole;
  });

  const nextButton = queryByRole('button', { name: /next/i });
  expect(nextButton).not.toBeInTheDocument();
  const updateButton = queryByRole('button', { name: /update customer info/i });
  expect(updateButton).toBeInTheDocument();
});
