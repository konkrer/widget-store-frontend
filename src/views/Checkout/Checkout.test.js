import { act, fireEvent } from '@testing-library/react';
import axios from 'axios';

// local imports
import { renderWithStore } from '../../utils/testHelpers';
import { TEST_DATA, populateTestDataHook } from '../../utils/testConfig';
import { testStore } from '../../redux/store/reduxStore';
import addProduct from '../../redux/actions/cart/addProduct';
import incrementQuantity from '../../redux/actions/cart/incrementQuantity';
import login from '../../redux/actions/user/login';
import logout from '../../redux/actions/user/logout';
// import resetCart from '../../redux/actions/cart/resetCart';
import Checkout from './Checkout';

jest.mock('axios');
window.scrollTo = jest.fn();

// mock useHistory methods
const mockUseHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockUseHistoryPush,
  }),
}));

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
  testStore.dispatch(addProduct(TEST_DATA.product));
});

beforeEach(() => {
  axios.mockResolvedValue(TEST_DATA.userProfileData);
});

afterEach(() => {
  jest.resetAllMocks();
  // testStore.dispatch(resetCart());
  testStore.dispatch(logout());
});

test('renders Checkout', async () => {
  await act(async () => {
    renderWithStore(<Checkout />);
  });
});

test('renders Checkout when user signed in', async () => {
  testStore.dispatch(login({}, 'token'));
  await act(async () => {
    renderWithStore(<Checkout />);
  });
});

// test('snapshot', async () => {
//   const { asFragment } = renderWithStore(<Checkout />);
//   expect(asFragment()).toMatchSnapshot();
// });

test('history pushes "/shop" on panel close', async () => {
  let getByRole;
  await act(async () => {
    const resp = renderWithStore(<Checkout />);
    getByRole = resp.getByRole;
  });

  const closeButton = getByRole('button', { name: 'close' });
  fireEvent.click(closeButton);
  expect(mockUseHistoryPush.mock.calls.length).toBe(1);
});

test('calculates and shows tax with customer data', async () => {
  testStore.dispatch(login({}, 'token'));
  let queryByText, getByRole;
  await act(async () => {
    const resp = renderWithStore(<Checkout />);
    queryByText = resp.queryByText;
    getByRole = resp.getByRole;
  });

  let tax = queryByText(/\$0\.00/);
  expect(tax).not.toBeInTheDocument();

  // click next button
  const nextButton = getByRole('button', { name: /next/i });
  await act(async () => {
    fireEvent.click(nextButton);
  });

  // expect tax to be present
  tax = queryByText(/\$0\.00/);
  expect(tax).toBeInTheDocument();
});

test('calculates and shows CA tax with customer data', async () => {
  const userCopy = TEST_DATA.userProfileData;
  userCopy.data.user.state = 'california';
  axios.mockResolvedValue(userCopy);

  testStore.dispatch(login({}, 'token'));

  let queryByText, getByRole;
  await act(async () => {
    const resp = renderWithStore(<Checkout />);
    queryByText = resp.queryByText;
    getByRole = resp.getByRole;
  });

  let tax = queryByText(/\$3403\.40/);
  expect(tax).not.toBeInTheDocument();

  // click next button
  const nextButton = getByRole('button', { name: /next/i });
  await act(async () => {
    fireEvent.click(nextButton);
  });

  // expect tax to be present
  tax = queryByText(/\$3403\.40/);
  expect(tax).toBeInTheDocument();
});

test('updates CA tax with cart change', async () => {
  const userCopy = TEST_DATA.userProfileData;
  userCopy.data.user.state = 'california';
  axios.mockResolvedValue(userCopy);

  testStore.dispatch(login({}, 'token'));

  let queryByText, getByRole;
  await act(async () => {
    const resp = renderWithStore(<Checkout />);
    queryByText = resp.queryByText;
    getByRole = resp.getByRole;
  });

  // click next button
  const nextButton = getByRole('button', { name: /next/i });
  await act(async () => {
    fireEvent.click(nextButton);
  });

  // expect original tax to be present
  let tax = queryByText(/\$3403\.40/);
  expect(tax).toBeInTheDocument();

  // change quantity
  await act(async () => {
    testStore.dispatch(incrementQuantity(TEST_DATA.product.product_id));
  });

  // expect original tax not to be present
  tax = queryByText(/\$3403\.40/);
  expect(tax).not.toBeInTheDocument();

  // expect new tax  to be present
  tax = queryByText(/\$3437\.43/);
  expect(tax).toBeInTheDocument();
});

test('opens shared layout modal on item name click', async () => {
  let getByRole, getByText;
  await act(async () => {
    const resp = renderWithStore(<Checkout />);
    getByRole = resp.getByRole;
    getByText = resp.getByText;
  });

  let productNameButton = getByRole('button', {
    name: 'Samsung XG-900 55 inch LCD TV',
  });
  await act(async () => {
    fireEvent.click(productNameButton);
  });

  // byline should be present
  const byline = getByText('Latest generation smart televison 2021');
  expect(byline).toBeInTheDocument();
});
