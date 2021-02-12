/** OrderSuccess tests */
import { act, fireEvent } from '@testing-library/react';

// local imports
import OrderSuccess from './OrderSuccess';
import { renderWithStore } from '../../utils/testHelpers';
import { TEST_DATA, populateTestDataHook } from '../../utils/testConfig';

const axios = require('axios');
jest.mock('axios');

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

beforeEach(() => {
  axios.mockResolvedValue({
    data: {
      order: TEST_DATA.orderGet,
    },
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders OrderSuccess', async () => {
  await act(async () => {
    renderWithStore(<OrderSuccess />);
  });
});

// test('OrderSuccess snapshot', async () => {
//   let asFragment;
//   await act(async () => {
//     const resp = renderWithStore(<OrderSuccess />);
//     asFragment = resp.asFragment;
//   });
//   expect(asFragment()).toMatchSnapshot();
// });

test('panel close calls history push "/shop"', async () => {
  let getByRole;
  await act(async () => {
    const resp = renderWithStore(<OrderSuccess />);
    getByRole = resp.getByRole;
  });
  const closeButton = getByRole('button', { name: 'close' });
  fireEvent.click(closeButton);

  expect(mockUseHistoryPush.mock.calls.length).toBe(1);
  expect(mockUseHistoryPush.mock.calls[0][0]).toBe('/shop');
});
