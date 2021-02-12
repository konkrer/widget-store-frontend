/** CartIconBadge tests */

// local imports
import { renderWithStore } from '../../../utils/testHelpers';
import CartIconBadge from './CartIconBadge';

test('renders CartIconBadge', () => {
  renderWithStore(<CartIconBadge />);
});

test('renders CartIconBadge without itemCount of 0 dispayed', () => {
  const { queryByText } = renderWithStore(<CartIconBadge numCartItems={0} />);

  const quantBadge = queryByText(/cart items/);
  expect(quantBadge).not.toBeInTheDocument();
});

test('renders CartIconBadge w/ itemCount of > 0 dispayed', () => {
  const { queryByText } = renderWithStore(<CartIconBadge numCartItems={3} />);

  const quantBadge = queryByText(/cart items/);
  expect(quantBadge).toBeInTheDocument();
});
