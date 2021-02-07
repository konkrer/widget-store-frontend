/** ProductList tests */

// local imports
import { act } from '@testing-library/react';
import { renderWithStore } from '../../helpers/testHelpers';
import { TEST_DATA, populateTestDataHook } from '../../helpers/testConfig';
import ProductList from './ProductList';

const axios = require('axios');
jest.mock('axios');

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
});

beforeEach(() => {
  axios.mockResolvedValue({
    data: {
      products: [TEST_DATA.product],
    },
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders ProductList', async () => {
  await act(async () => {
    renderWithStore(<ProductList />);
  });
});

test('ProductList snapshot', async () => {
  let asFragment;
  await act(async () => {
    const resp = renderWithStore(<ProductList />);
    asFragment = resp.asFragment;
  });
  expect(asFragment()).toMatchSnapshot();
});

test('Product name in document', async () => {
  let getByText;
  await act(async () => {
    const resp = renderWithStore(<ProductList />);
    getByText = resp.getByText;
  });
  const cardText = getByText('Samsung XG-900 55 inch LCD TV');
  expect(cardText).toBeInTheDocument();
});
