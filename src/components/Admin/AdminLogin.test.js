import { act, fireEvent } from '@testing-library/react';
import axios from 'axios';

// local imports
import { renderWithStore } from '../../utils/testHelpers';
import { TEST_DATA, populateTestDataHook } from '../../utils/testConfig';
import { testStore } from '../../redux/store/reduxStore';
import logout from '../../redux/actions/user/logout';
import AdminLogin from './AdminLogin';

// mock
jest.mock('axios');
const setAdminUser = jest.fn();

const mockUseHistoryGoBack = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockUseHistoryGoBack,
  }),
}));

// label regexs and test values for form inputs testing
const inputs = [
  [/email/i, 'bob@bobert.com'],
  [/password/i, 'Password1'],
];

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
});

beforeEach(() => {});

afterEach(() => {
  jest.resetAllMocks();
  testStore.dispatch(logout());
});

test('AdminLogin should render', () => {
  const { queryByLabelText } = renderWithStore(
    <AdminLogin adminUser={false} setAdminUser={setAdminUser} />
  );

  const emailInput = queryByLabelText(/email/i);
  expect(emailInput).toBeInTheDocument();
});

test('redirects when admin user true', async () => {
  const { queryByLabelText } = renderWithStore(
    <AdminLogin adminUser={true} setAdminUser={setAdminUser} />
  );

  const emailInput = queryByLabelText(/email/i);
  expect(emailInput).not.toBeInTheDocument();
});

test('AdminLogin should set adminUser true after successful login', async () => {
  axios.mockResolvedValue({ data: { token: 'token', user: {} } });

  let queryByLabelText, getByRole;
  await act(async () => {
    const resp = renderWithStore(
      <AdminLogin adminUser={false} setAdminUser={setAdminUser} />
    );
    queryByLabelText = resp.queryByLabelText;
    getByRole = resp.getByRole;
  });

  await act(async () => {
    inputs.forEach(([regex, val]) => {
      const input = queryByLabelText(regex);
      fireEvent.change(input, { target: { value: val } });
    });
  });

  const loginButton = getByRole('button', { name: /login/i });
  await act(async () => {
    fireEvent.click(loginButton);
  });

  expect(setAdminUser.mock.calls.length).toBe(1);
  expect(setAdminUser.mock.calls[0][0]).toBe(true);
});

test('AdminLogin should show error alert with axios error', async () => {
  axios.mockResolvedValue({
    error: { response: { data: { message: 'bad error' } } },
  });

  let queryByLabelText, getByRole;
  await act(async () => {
    const resp = renderWithStore(
      <AdminLogin adminUser={false} setAdminUser={setAdminUser} />
    );
    queryByLabelText = resp.queryByLabelText;
    getByRole = resp.getByRole;
  });

  await act(async () => {
    inputs.forEach(([regex, val]) => {
      const input = queryByLabelText(regex);
      fireEvent.change(input, { target: { value: val } });
    });
  });

  const loginButton = getByRole('button', { name: /login/i });
  await act(async () => {
    fireEvent.click(loginButton);
  });

  getByRole('alert', { name: /error/i });
  expect(setAdminUser.mock.calls.length).toBe(0);
});

test('should call history goBack on modal close', () => {
  const { getByRole } = renderWithStore(
    <AdminLogin adminUser={false} setAdminUser={setAdminUser} />
  );

  const cancelButton = getByRole('button', { name: /cancel/i });
  fireEvent.click(cancelButton);

  expect(mockUseHistoryGoBack.mock.calls.length).toBe(1);
});
