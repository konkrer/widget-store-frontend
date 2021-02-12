import { act, fireEvent } from '@testing-library/react';
import axios from 'axios';

// local imports
import { renderWithStore } from '../../../utils/testHelpers';
import { testStore } from '../../../redux/store/reduxStore';
import logout from '../../../redux/actions/user/logout';
import Login from './Login';

jest.mock('axios');

afterEach(() => {
  jest.resetAllMocks();
});

test('should render', () => {
  renderWithStore(<Login />);
});

test('Login snapshot', async () => {
  const { asFragment } = renderWithStore(<Login />);
  expect(asFragment()).toMatchSnapshot();
});

test('shoud store user data in store with submit success', async () => {
  axios.mockResolvedValue({ data: { user: { user: 'user' }, token: 'token' } });

  const { getByLabelText, getByRole } = renderWithStore(<Login />);

  const emailInput = getByLabelText(/email/i);
  await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'abc@def.gh' } });
  });

  const passwordInput = getByLabelText(/password/i);
  await act(async () => {
    fireEvent.change(passwordInput, { target: { value: 'Password1' } });
  });

  const loginButton = getByRole('button', { name: /login/i });
  await act(async () => {
    fireEvent.click(loginButton);
  });

  expect(axios).toHaveBeenCalled();
  expect(axios.mock.calls.length).toBe(1);
  expect(axios.mock.calls[0][0].url).toBe('/login');
  expect(axios.mock.calls[0][0].method).toBe('post');
  expect(axios.mock.calls[0][0].data.email).toBe('abc@def.gh');
  expect(axios.mock.calls[0][0].data.password).toBe('Password1');

  // expect store.user data to have been populated
  const user = testStore.getState().user;
  expect(user.token).toBe('token');
  expect(user.user.user).toBe('user');

  testStore.dispatch(logout());
});

test('shoud not call axios with bad email', async () => {
  const { getByLabelText, getByRole } = renderWithStore(<Login />);

  const emailInput = getByLabelText(/email/i);
  await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'abc@def.' } });
  });

  const passwordInput = getByLabelText(/password/i);
  await act(async () => {
    fireEvent.change(passwordInput, { target: { value: 'Password1' } });
  });

  const loginButton = getByRole('button', { name: /login/i });
  await act(async () => {
    fireEvent.click(loginButton);
  });

  expect(axios).not.toHaveBeenCalled();
});

test('shoud not call axios with bad password', async () => {
  const { getByLabelText, getByRole } = renderWithStore(<Login />);

  const emailInput = getByLabelText(/email/i);
  await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'abc@def.gh' } });
  });

  const passwordInput = getByLabelText(/password/i);
  await act(async () => {
    fireEvent.change(passwordInput, { target: { value: 'Password' } });
  });

  const loginButton = getByRole('button', { name: /login/i });
  await act(async () => {
    fireEvent.click(loginButton);
  });

  expect(axios).not.toHaveBeenCalled();
});

test('shoud show error message with submit failure', async () => {
  axios.mockResolvedValue({
    error: { response: { data: { message: 'error message' } } },
  });

  const { getByLabelText, getByRole } = renderWithStore(<Login />);

  const emailInput = getByLabelText(/email/i);
  await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'abc@def.gh' } });
  });

  const passwordInput = getByLabelText(/password/i);
  await act(async () => {
    fireEvent.change(passwordInput, { target: { value: 'Password1' } });
  });

  const loginButton = getByRole('button', { name: /login/i });
  await act(async () => {
    fireEvent.click(loginButton);
  });

  expect(axios).toHaveBeenCalled();
  const user = testStore.getState().user;

  expect(user.token).toBe(null);
  expect(user.user).toBe(null);

  const errorMessage = getByRole('alert');
  expect(errorMessage).toBeInTheDocument();
  expect(errorMessage.textContent).toBe('error message');
});

test('show password button shows/hides password', async () => {
  const { getByLabelText, getByRole } = renderWithStore(<Login />);

  const showPasswordtn = getByRole('button', { name: /show password/i });
  const passwordInput = getByLabelText(/password/i);

  await act(async () => {
    fireEvent.change(passwordInput, { target: { value: 'Password1' } });
  });

  expect(passwordInput.type).toBe('password');

  await act(async () => {
    fireEvent.click(showPasswordtn);
  });

  expect(passwordInput.type).toBe('text');

  await act(async () => {
    fireEvent.click(showPasswordtn);
  });

  expect(passwordInput.type).toBe('password');
});
