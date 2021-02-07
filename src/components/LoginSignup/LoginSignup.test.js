// local imports
// import { fireEvent } from '@testing-library/react';
import { renderWithStore } from '../../helpers/testHelpers';
import LoginSignup from './LoginSignup';

test('should render', () => {
  renderWithStore(<LoginSignup />);
});

test('LoginSignup snapshot', async () => {
  const { asFragment } = renderWithStore(<LoginSignup />);
  expect(asFragment()).toMatchSnapshot();
});

// test('login form shows and signup form can be accessed', () => {
//   const { queryByLabelText, getByRole, debug } = renderWithStore(
//     <LoginSignup />
//   );

//   // login form should show and have no username input and have login button
//   let usernameInput = queryByLabelText(/username/i);
//   const signupButton = getByRole('button', { name: /signup/i });
//   const loginButton = getByRole('button', { name: /login/i });
//   debug();
//   expect(signupButton).not.toBeVisible();
//   expect(usernameInput).not.toBeVisible();
//   expect(loginButton).toBeInTheDocument();

//   // change tab to signup form
//   const signupTab = getByRole('link', { name: /signup/i });
//   fireEvent.click(signupTab);
// });
