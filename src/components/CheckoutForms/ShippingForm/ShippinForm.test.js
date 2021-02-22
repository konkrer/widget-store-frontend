import { act, render, fireEvent } from '@testing-library/react';

// local imports
import { TEST_DATA, populateTestDataHook } from '../../../utils/testConfig';
import ShippingForm from './ShippingForm';

const setOrderData = jest.fn();
const goTo1 = jest.fn();
const goTo3 = jest.fn();
const setShippingCheckmark = jest.fn();

let orderData;

beforeEach(() => {
  populateTestDataHook(TEST_DATA);

  orderData = {
    shipping: null,
    shippingAddress: null,
    tax: '0.00',
    total: '400.4',
    customer: TEST_DATA.CustomerInfoFormsValues,
  };
});

afterEach(() => {
  jest.resetAllMocks();
});

test('Shipping form renders', () => {
  const { getByText } = render(
    <ShippingForm
      orderData={orderData}
      setOrder={setOrderData}
      goTo1={goTo1}
      goTo3={goTo3}
      responseError={null}
      loadingShipping={false}
      shippingMethods={TEST_DATA.shippingMethods}
      subtotal={'10.00'}
      setShippingCheckmark={setShippingCheckmark}
    />
  );

  // will fail if shipping form not rendered
  getByText(/customer info/i);
  getByText(/shipping address/i);
  getByText(/shipping options/i);
});

test('clicking option calls setOrderData', async () => {
  let getByRole, getByLabelText;
  await act(async () => {
    const resp = render(
      <ShippingForm
        orderData={orderData}
        setOrderData={setOrderData}
        goTo1={goTo1}
        goTo3={goTo3}
        responseError={null}
        loadingShipping={false}
        shippingMethods={TEST_DATA.shippingMethods}
        subtotal={'10.00'}
        setShippingCheckmark={setShippingCheckmark}
      />
    );
    getByRole = resp.getByRole;
    getByLabelText = resp.getByLabelText;
  });

  // change input
  const shippingInput = getByLabelText(/shipping options/i);
  await act(async () => {
    fireEvent.change(shippingInput, { target: { value: ['ups_ground'] } });
  });
  // click option
  const upsOption = getByRole('option', {
    name: /UPS ground shipping \(3-6 days\)/i,
  });
  await act(async () => {
    fireEvent.click(upsOption);
  });

  // expect orderData update
  expect(setOrderData.mock.calls.length).toBe(1);
  const newOrderData = setOrderData.mock.calls[0][0]({});
  expect(newOrderData.shipping).toHaveProperty('shipping_method');
  expect(newOrderData.shipping).toHaveProperty('details');

  // expect animation cycle happened
  await new Promise(res => setTimeout(res, 550));
  expect(setShippingCheckmark.mock.calls.length).toBe(2);

  expect(goTo3.mock.calls.length).toBe(1);
});

test("clicking the select input (not option) doesn't call setOrderData", async () => {
  let getByLabelText;
  await act(async () => {
    const resp = render(
      <ShippingForm
        orderData={orderData}
        setOrderData={setOrderData}
        goTo1={goTo1}
        goTo3={goTo3}
        responseError={null}
        loadingShipping={false}
        shippingMethods={TEST_DATA.shippingMethods}
        subtotal={'10.00'}
        setShippingCheckmark={setShippingCheckmark}
      />
    );
    getByLabelText = resp.getByLabelText;
  });
  // click input
  const shippingInput = getByLabelText(/shipping options/i);
  await act(async () => {
    fireEvent.click(shippingInput);
  });
  // expect no orderData update
  expect(setOrderData.mock.calls.length).toBe(0);

  // expect no animation cycle happened
  await new Promise(res => setTimeout(res, 550));
  expect(setShippingCheckmark.mock.calls.length).toBe(0);
  expect(goTo3.mock.calls.length).toBe(0);
});

test('check mark does not animate if shipping already set', async () => {
  let getByRole, getByLabelText;
  await act(async () => {
    const resp = render(
      <ShippingForm
        orderData={{ ...orderData, shipping: true }}
        setOrderData={setOrderData}
        goTo1={goTo1}
        goTo3={goTo3}
        responseError={null}
        loadingShipping={false}
        shippingMethods={TEST_DATA.shippingMethods}
        subtotal={'10.00'}
        setShippingCheckmark={setShippingCheckmark}
      />
    );
    getByRole = resp.getByRole;
    getByLabelText = resp.getByLabelText;
  });

  // set shipping_method value
  const shippingInput = getByLabelText(/shipping options/i);
  await act(async () => {
    fireEvent.change(shippingInput, { target: { value: ['ups_ground'] } });
  });
  // click shipping option
  const upsOption = getByRole('option', {
    name: /UPS ground shipping \(3-6 days\)/i,
  });
  await act(async () => {
    fireEvent.click(upsOption);
  });

  // expect animation cycle not happened. does goTo3
  await new Promise(res => setTimeout(res, 550));
  expect(setShippingCheckmark.mock.calls.length).toBe(0);
  expect(goTo3.mock.calls.length).toBe(1);

  // click next
  const nextButton = getByRole('button', { name: /next/i });
  await act(async () => {
    fireEvent.click(nextButton);
  });
  // no additonal animation. called goTo3.
  expect(setShippingCheckmark.mock.calls.length).toBe(0);
  expect(goTo3.mock.calls.length).toBe(2);
});

test('clicking next calls setOrderData if shipping data not set', async () => {
  let getByRole, getByLabelText;
  await act(async () => {
    const resp = render(
      <ShippingForm
        orderData={orderData}
        setOrderData={setOrderData}
        goTo1={goTo1}
        goTo3={goTo3}
        responseError={null}
        loadingShipping={false}
        shippingMethods={TEST_DATA.shippingMethods}
        subtotal={'10.00'}
        setShippingCheckmark={setShippingCheckmark}
      />
    );
    getByRole = resp.getByRole;
    getByLabelText = resp.getByLabelText;
  });

  // change input value but don't click. shipping data will not set by
  // form onClick listener.
  const shippingInput = getByLabelText(/shipping options/i);
  await act(async () => {
    fireEvent.change(shippingInput, { target: { value: ['ups_ground'] } });
  });

  // click next
  const nextButton = getByRole('button', { name: /next/i });
  await act(async () => {
    fireEvent.click(nextButton);
  });

  // expect orderData update
  expect(setOrderData.mock.calls.length).toBe(1);
  const newOrderData = setOrderData.mock.calls[0][0]({});
  expect(newOrderData.shipping).toHaveProperty('shipping_method');
  expect(newOrderData.shipping).toHaveProperty('details');

  // expect animation cycle happened
  await new Promise(res => setTimeout(res, 550));
  expect(setShippingCheckmark.mock.calls.length).toBe(2);

  expect(goTo3.mock.calls.length).toBe(1);
});

test('shows shipping response error when error', async () => {
  let getByRole;
  await act(async () => {
    const resp = render(
      <ShippingForm
        orderData={orderData}
        setOrderData={setOrderData}
        goTo1={goTo1}
        goTo3={goTo3}
        responseError={'bad error'}
        loadingShipping={false}
        shippingMethods={TEST_DATA.shippingMethods}
        subtotal={'10.00'}
        setShippingCheckmark={setShippingCheckmark}
      />
    );
    getByRole = resp.getByRole;
  });

  // expect alert
  const errorAlert = getByRole('alert', { name: /error/i });
  expect(errorAlert.textContent).toBe('bad error');
});

test('disallows submitting without selection', async () => {
  let getByRole;
  await act(async () => {
    const resp = render(
      <ShippingForm
        orderData={orderData}
        setOrderData={setOrderData}
        goTo1={goTo1}
        goTo3={goTo3}
        responseError={null}
        loadingShipping={false}
        shippingMethods={TEST_DATA.shippingMethods}
        subtotal={'10.00'}
        setShippingCheckmark={setShippingCheckmark}
      />
    );
    getByRole = resp.getByRole;
  });

  // click next
  const nextButton = getByRole('button', { name: /next/i });
  await act(async () => {
    fireEvent.click(nextButton);
  });

  // expect orderData not updated
  expect(setOrderData).not.toHaveBeenCalled();

  // expect animation cycle not happened
  await new Promise(res => setTimeout(res, 550));
  expect(setShippingCheckmark).not.toHaveBeenCalled();
  expect(goTo3).not.toHaveBeenCalled();
});
