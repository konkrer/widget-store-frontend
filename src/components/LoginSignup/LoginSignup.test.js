// local imports
import { fireEvent } from '@testing-library/react';
import { renderWithStore } from '../../utils/testHelpers';
import LoginSignup from './LoginSignup';

const mockUseHistoryGoBack = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockUseHistoryGoBack,
  }),
}));

afterEach(() => jest.resetAllMocks());

test('should render', () => {
  renderWithStore(<LoginSignup />);
});

test('LoginSignup snapshot', async () => {
  const { asFragment } = renderWithStore(<LoginSignup />);
  expect(asFragment()).toMatchSnapshot();
});

/** this test need to be improved - no assertions */
test('changing tabs login/signup ok', () => {
  const { getByTestId } = renderWithStore(<LoginSignup />);

  const loginLink = getByTestId('login tab link');
  const signupLink = getByTestId('signup tab link');

  fireEvent.click(loginLink);
  fireEvent.click(signupLink);
});

test('close button calls history goBack', () => {
  const { getAllByRole } = renderWithStore(<LoginSignup />);

  const cancelBtn = getAllByRole('button', { name: /cancel/i });
  fireEvent.click(cancelBtn[0]);

  expect(mockUseHistoryGoBack.mock.calls.length).toBe(1);
});
