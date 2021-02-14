import { act } from '@testing-library/react';

// local imports
import { TEST_DATA, populateTestDataHook } from '../../../utils/testConfig';
import { renderWithStore } from '../../../utils/testHelpers';
import PaymentForm from './PaymentForm';

const goTo2 = jest.fn();

jest.mock('braintree-web-drop-in', () => ({
  ...jest.requireActual('braintree-web-drop-in'),
  create: async () => {
    throw new Error('bad error');
  },
}));

let orderData;

beforeAll(() => {
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

test('shows error when error', async () => {
  await act(async () => {
    const { getByRole } = renderWithStore(
      <PaymentForm orderData={orderData} goTo2={goTo2} />
    );

    // wait for timeout to create dropin
    await new Promise(res => setTimeout(res, 950));

    // expect alert with error message
    const errorAlert = getByRole('alert', { name: /error/i });
    expect(errorAlert.textContent).toBe('bad error');
  });
});
