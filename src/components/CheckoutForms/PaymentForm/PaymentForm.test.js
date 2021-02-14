import { act, render, fireEvent } from '@testing-library/react';

// local imports
import { TEST_DATA, populateTestDataHook } from '../../../utils/testConfig';
import { renderWithStore } from '../../../utils/testHelpers';
import PaymentForm from './PaymentForm';

const goTo2 = jest.fn();

// const mockDropinCreate = jest.fn(async () => {
//   return new Promise.resolve();
// });

// jest.mock('braintree-web-drop-in', () => ({
//   ...jest.requireActual('braintree-web-drop-in'),
//   create: () => mockDropinCreate,
// }));

// const instance = jest.fn();
// instance.requestPaymentMethod.mockImplementation();

let orderData;

beforeEach(() => {
  populateTestDataHook(TEST_DATA);

  orderData = {
    shipping: { details: { name: 'ups', cost: '15.55' } },
    shippingAddress: null,
    tax: '34.03',
    total: '434.43',
    customer: TEST_DATA.CustomerInfoFormsValues,
  };
});

afterEach(() => {
  jest.resetAllMocks();
});

test('Payment form renders', async () => {
  const { getByText } = renderWithStore(
    <PaymentForm orderData={orderData} goTo2={goTo2} />
  );

  // will fail if payment form not rendered
  getByText(/customer info/i);
  getByText(/shipping address/i);
  getByText(/shipping method/i);

  // expect(mockDropinCreate).not.toHaveBeenCalled();

  // wait for dropin to mount after timeout
  await new Promise(res => setTimeout(res, 950));
  //   expect(mockDropinCreate).toHaveBeenCalled();
});

// test('clicking option calls setOrderData', async () => {
//   let getByRole, getByLabelText;
//   await act(async () => {
//     const resp = render(
//       <PaymentForm
//         orderData={orderData}
//         setOrderData={setOrderData}
//         goTo1={goTo1}
//         goTo3={goTo3}
//         responseError={null}
//         loadingShipping={false}
//         shippingMethods={TEST_DATA.shippingMethods}
//         subtotal={'10.00'}
//         setShippingCheckmark={setShippingCheckmark}
//       />
//     );
//     getByRole = resp.getByRole;
//     getByLabelText = resp.getByLabelText;
//   });

//   // change input
//   const shippingInput = getByLabelText(/shipping options/i);
//   await act(async () => {
//     fireEvent.change(shippingInput, { target: { value: ['ups_ground'] } });
//   });
//   // click option
//   const upsOption = getByRole('option', {
//     name: /UPS ground shipping \(3-6 days\)/i,
//   });
//   await act(async () => {
//     fireEvent.click(upsOption);
//   });

//   // expect orderData update
//   expect(setOrderData.mock.calls.length).toBe(1);
//   const newOrderData = setOrderData.mock.calls[0][0]({});
//   expect(newOrderData.shipping).toHaveProperty('shipping_method');
//   expect(newOrderData.shipping).toHaveProperty('details');

//   // expect animation cycle happened
//   await new Promise(res => setTimeout(res, 550));
//   expect(setShippingCheckmark.mock.calls.length).toBe(2);

//   expect(goTo3.mock.calls.length).toBe(1);
// });

// test('check mark does not animate if shipping already set', async () => {
//   let getByRole, getByLabelText;
//   await act(async () => {
//     const resp = render(
//       <PaymentForm
//         orderData={{ ...orderData, shipping: true }}
//         setOrderData={setOrderData}
//         goTo1={goTo1}
//         goTo3={goTo3}
//         responseError={null}
//         loadingShipping={false}
//         shippingMethods={TEST_DATA.shippingMethods}
//         subtotal={'10.00'}
//         setShippingCheckmark={setShippingCheckmark}
//       />
//     );
//     getByRole = resp.getByRole;
//     getByLabelText = resp.getByLabelText;
//   });

//   // select shipping option
//   const shippingInput = getByLabelText(/shipping options/i);
//   await act(async () => {
//     fireEvent.change(shippingInput, { target: { value: ['ups_ground'] } });
//   });
//   const upsOption = getByRole('option', {
//     name: /UPS ground shipping \(3-6 days\)/i,
//   });
//   await act(async () => {
//     fireEvent.click(upsOption);
//   });

//   // expect animation cycle not happened. does not goTo3
//   await new Promise(res => setTimeout(res, 550));
//   expect(setShippingCheckmark.mock.calls.length).toBe(0);
//   expect(goTo3.mock.calls.length).toBe(0);

//   // click next
//   const nextButton = getByRole('button', { name: /next/i });
//   await act(async () => {
//     fireEvent.click(nextButton);
//   });
//   // no additonal animation. called goTo3.
//   expect(setShippingCheckmark.mock.calls.length).toBe(0);
//   expect(goTo3.mock.calls.length).toBe(1);
// });

// test('clicking next calls setOrderData if shipping data not set', async () => {
//   let getByRole, getByLabelText;
//   await act(async () => {
//     const resp = render(
//       <PaymentForm
//         orderData={orderData}
//         setOrderData={setOrderData}
//         goTo1={goTo1}
//         goTo3={goTo3}
//         responseError={null}
//         loadingShipping={false}
//         shippingMethods={TEST_DATA.shippingMethods}
//         subtotal={'10.00'}
//         setShippingCheckmark={setShippingCheckmark}
//       />
//     );
//     getByRole = resp.getByRole;
//     getByLabelText = resp.getByLabelText;
//   });

//   // change input value but don't click. shipping data will not set by
//   // form onClick listener.
//   const shippingInput = getByLabelText(/shipping options/i);
//   await act(async () => {
//     fireEvent.change(shippingInput, { target: { value: ['ups_ground'] } });
//   });

//   // click next
//   const nextButton = getByRole('button', { name: /next/i });
//   await act(async () => {
//     fireEvent.click(nextButton);
//   });

//   // expect orderData update
//   expect(setOrderData.mock.calls.length).toBe(1);
//   const newOrderData = setOrderData.mock.calls[0][0]({});
//   expect(newOrderData.shipping).toHaveProperty('shipping_method');
//   expect(newOrderData.shipping).toHaveProperty('details');

//   // expect animation cycle happened
//   await new Promise(res => setTimeout(res, 550));
//   expect(setShippingCheckmark.mock.calls.length).toBe(2);

//   expect(goTo3.mock.calls.length).toBe(1);
// });

// test('shows shipping response error when error', async () => {
//   let getByRole;
//   await act(async () => {
//     const resp = render(
//       <PaymentForm
//         orderData={orderData}
//         setOrderData={setOrderData}
//         goTo1={goTo1}
//         goTo3={goTo3}
//         responseError={'bad error'}
//         loadingShipping={false}
//         shippingMethods={TEST_DATA.shippingMethods}
//         subtotal={'10.00'}
//         setShippingCheckmark={setShippingCheckmark}
//       />
//     );
//     getByRole = resp.getByRole;
//   });

//   // click next
//   const errorAlert = getByRole('alert', { name: /error/i });
//   expect(errorAlert.textContent).toBe('bad error');
// });

// test('disallows submitting without selection', async () => {
//   let getByRole;
//   await act(async () => {
//     const resp = render(
//       <PaymentForm
//         orderData={orderData}
//         setOrderData={setOrderData}
//         goTo1={goTo1}
//         goTo3={goTo3}
//         responseError={null}
//         loadingShipping={false}
//         shippingMethods={TEST_DATA.shippingMethods}
//         subtotal={'10.00'}
//         setShippingCheckmark={setShippingCheckmark}
//       />
//     );
//     getByRole = resp.getByRole;
//   });

//   // click next
//   const nextButton = getByRole('button', { name: /next/i });
//   await act(async () => {
//     fireEvent.click(nextButton);
//   });

//   // expect orderData not updated
//   expect(setOrderData).not.toHaveBeenCalled();

//   // expect animation cycle not happened
//   await new Promise(res => setTimeout(res, 550));
//   expect(setShippingCheckmark).not.toHaveBeenCalled();
//   expect(goTo3).not.toHaveBeenCalled();
// });
