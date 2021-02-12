import { act, fireEvent } from '@testing-library/react';
import axios from 'axios';

// local imports
import { renderWithStore } from '../../../utils/testHelpers';
import { testStore } from '../../../redux/store/reduxStore';
import logout from '../../../redux/actions/user/logout';
import Signup from './Signup';

jest.mock('axios');

// label regexs and test values for form inputs testing
let inputs;

beforeEach(() => {
  inputs = [
    [/username/i, 'test_user'],
    [/email/i, 'abc@def.gh'],
    [/password/i, 'Password1'],
  ];
});

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

  // add values to all inputs
  await act(async () => {
    inputs.forEach(async ([re, text]) => {
      const input = getByLabelText(re);
      fireEvent.change(input, { target: { value: text } });
    });
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

  // make username input value too short
  inputs[0][1] = 't';

  // add values to all inputs
  await act(async () => {
    inputs.forEach(async ([re, text]) => {
      const input = getByLabelText(re);
      fireEvent.change(input, { target: { value: text } });
    });
  });

  const SignupButton = getByRole('button', { name: /Signup/i });
  await act(async () => {
    fireEvent.click(SignupButton);
  });

  expect(axios).not.toHaveBeenCalled();
});

test('shoud not call axios with bad email', async () => {
  const { getByLabelText, getByRole } = renderWithStore(<Signup />);

  // make email input value incorrect
  inputs[1][1] = 'abc@cd.';

  // add values to all inputs
  await act(async () => {
    inputs.forEach(async ([re, text]) => {
      const input = getByLabelText(re);
      fireEvent.change(input, { target: { value: text } });
    });
  });

  const SignupButton = getByRole('button', { name: /Signup/i });
  await act(async () => {
    fireEvent.click(SignupButton);
  });

  expect(axios).not.toHaveBeenCalled();
});

test('shoud not call axios with bad password', async () => {
  const { getByLabelText, getByRole } = renderWithStore(<Signup />);

  // make password input missing number
  inputs[2][1] = 'Password';

  // add values to all inputs
  await act(async () => {
    inputs.forEach(async ([re, text]) => {
      const input = getByLabelText(re);
      fireEvent.change(input, { target: { value: text } });
    });
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

  // add values to all inputs
  await act(async () => {
    inputs.forEach(async ([re, text]) => {
      const input = getByLabelText(re);
      fireEvent.change(input, { target: { value: text } });
    });
  });

  const SignupButton = getByRole('button', { name: /Signup/i });
  await act(async () => {
    fireEvent.click(SignupButton);
  });

  expect(axios).toHaveBeenCalled();
  const user = testStore.getState().user;

  expect(user.token).toBe(null);
  expect(user.user).toBe(null);

  const alert = getByRole('alert');
  expect(alert).toBeInTheDocument();
  expect(alert.textContent).toBe('error message');
});

test('show password button shows/hides password', async () => {
  const { getByLabelText, getByRole } = renderWithStore(<Signup />);

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
