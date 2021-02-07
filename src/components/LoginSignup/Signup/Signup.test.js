import { act, fireEvent } from '@testing-library/react';
import axios from 'axios';

// local imports
import { renderWithStore } from '../../../helpers/testHelpers';
import { testStore } from '../../../redux/store/reduxStore';
import logout from '../../../redux/actions/user/logout';
import Signup from './Signup';

jest.mock('axios');

afterEach(() => {
  jest.resetAllMocks();
});

test('should render', () => {
  renderWithStore(<Signup />);
});

test('Signup snapshot', async () => {
  const { asFragment } = renderWithStore(<Signup />);
  expect(asFragment()).toMatchSnapshot();
});

test('shoud store user data in store with submit success', async () => {
  axios.mockResolvedValue({ data: { user: { user: 'user' }, token: 'token' } });

  const { getByLabelText, getByRole } = renderWithStore(<Signup />);

  const usernameInput = getByLabelText(/username/i);
  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: 'test_user' } });
  });

  const emailInput = getByLabelText(/email/i);
  await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'abc@def.gh' } });
  });

  const passwordInput = getByLabelText(/password/i);
  await act(async () => {
    fireEvent.change(passwordInput, { target: { value: 'Password1' } });
  });

  const SignupButton = getByRole('button', { name: /signup/i });
  await act(async () => {
    fireEvent.click(SignupButton);
  });

  expect(axios).toHaveBeenCalled();
  expect(axios.mock.calls.length).toBe(1);
  expect(axios.mock.calls[0][0].url).toBe('/users');
  expect(axios.mock.calls[0][0].method).toBe('post');
  expect(axios.mock.calls[0][0].data.username).toBe('test_user');
  expect(axios.mock.calls[0][0].data.email).toBe('abc@def.gh');
  expect(axios.mock.calls[0][0].data.password).toBe('Password1');

  // expect store.user data to have been populated
  const user = testStore.getState().user;
  expect(user.token).toBe('token');
  expect(user.user.user).toBe('user');

  testStore.dispatch(logout());
});

test('shoud not call axios with bad username', async () => {
  const { getByLabelText, getByRole } = renderWithStore(<Signup />);

  const usernameInput = getByLabelText(/username/i);
  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: 't' } });
  });

  const emailInput = getByLabelText(/email/i);
  await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'abc@def.gh' } });
  });

  const passwordInput = getByLabelText(/password/i);
  await act(async () => {
    fireEvent.change(passwordInput, { target: { value: 'Password1' } });
  });

  const SignupButton = getByRole('button', { name: /Signup/i });
  await act(async () => {
    fireEvent.click(SignupButton);
  });

  expect(axios).not.toHaveBeenCalled();
});

test('shoud not call axios with bad email', async () => {
  const { getByLabelText, getByRole } = renderWithStore(<Signup />);

  const usernameInput = getByLabelText(/username/i);
  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: 'test_user' } });
  });

  const emailInput = getByLabelText(/email/i);
  await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'abc@def.' } });
  });

  const passwordInput = getByLabelText(/password/i);
  await act(async () => {
    fireEvent.change(passwordInput, { target: { value: 'Password1' } });
  });

  const SignupButton = getByRole('button', { name: /Signup/i });
  await act(async () => {
    fireEvent.click(SignupButton);
  });

  expect(axios).not.toHaveBeenCalled();
});

test('shoud not call axios with bad password', async () => {
  const { getByLabelText, getByRole } = renderWithStore(<Signup />);

  const usernameInput = getByLabelText(/username/i);
  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: 'test_user' } });
  });

  const emailInput = getByLabelText(/email/i);
  await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'abc@def.gh' } });
  });

  const passwordInput = getByLabelText(/password/i);
  await act(async () => {
    fireEvent.change(passwordInput, { target: { value: 'Password' } });
  });

  const SignupButton = getByRole('button', { name: /Signup/i });
  await act(async () => {
    fireEvent.click(SignupButton);
  });

  expect(axios).not.toHaveBeenCalled();
});

test('shoud show error message with submit failure', async () => {
  axios.mockResolvedValue({
    error: { response: { data: { message: 'error message' } } },
  });

  const { getByLabelText, getByRole } = renderWithStore(<Signup />);

  const usernameInput = getByLabelText(/username/i);
  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: 'test_user' } });
  });

  const emailInput = getByLabelText(/email/i);
  await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'abc@def.gh' } });
  });

  const passwordInput = getByLabelText(/password/i);
  await act(async () => {
    fireEvent.change(passwordInput, { target: { value: 'Password1' } });
  });

  const SignupButton = getByRole('button', { name: /Signup/i });
  await act(async () => {
    fireEvent.click(SignupButton);
  });

  expect(axios).toHaveBeenCalled();
  const user = testStore.getState().user;

  expect(user.token).toBe(null);
  expect(user.user).toBe(null);

  const errorMessage = getByRole('alert');
  expect(errorMessage).toBeInTheDocument();
  expect(errorMessage.textContent).toBe('error message');
});
