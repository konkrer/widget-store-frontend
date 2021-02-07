/** Cart tests */

// local imports
import { renderWithStore } from '../../helpers/testHelpers';
import Cart from './Cart';

test('renders Cart', async () => {
  renderWithStore(<Cart />);
});

test('Cart snapshot', async () => {
  const { asFragment } = renderWithStore(<Cart />);
  expect(asFragment()).toMatchSnapshot();
});
