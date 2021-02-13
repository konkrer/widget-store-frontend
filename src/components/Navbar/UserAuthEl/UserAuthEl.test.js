import { fireEvent, act } from '@testing-library/react';

// local imports
import { renderWithStore } from '../../../utils/testHelpers';
import { testStore } from '../../../redux/store/reduxStore';
import login from '../../../redux/actions/user/login';
import logout from '../../../redux/actions/user/logout';
import UserAuthEl from './UserAuthEl';

afterEach(() => {
  testStore.dispatch(logout());
});

test('User Auth Element renders logout button when user signed in', () => {
  testStore.dispatch(login({}, 'token'));
  const { getByRole } = renderWithStore(<UserAuthEl pathRoot="/shop" />);

  const logoutBtn = getByRole('button', { name: /logout/i });
  expect(logoutBtn).toBeInTheDocument();
});

test('User Auth Element renders login link when user not signed in', () => {
  const { getByRole } = renderWithStore(<UserAuthEl pathRoot="/shop" />);

  const loginBtn = getByRole('link', { name: /login/i });
  expect(loginBtn).toBeInTheDocument();
});

test('logout button clears user from store', async () => {
  testStore.dispatch(login({}, 'token'));

  let user = testStore.getState().user;
  expect(user.token).toBe('token');

  const { getByRole } = renderWithStore(<UserAuthEl pathRoot="/shop" />);

  const logoutBtn = getByRole('button', { name: /logout/i });

  await act(async () => {
    fireEvent.click(logoutBtn);
  });

  user = testStore.getState().user;
  expect(user.token).toBe(null);
});
