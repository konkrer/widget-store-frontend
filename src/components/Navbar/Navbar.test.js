/** Navbar tests */

// local imports
import { renderWithStore } from '../../utils/testHelpers';
import Navbar from './Navbar';

test('renders Navbar', () => {
  renderWithStore(<Navbar />);
});

test('navbar snapshot', () => {
  const { asFragment } = renderWithStore(<Navbar />);
  expect(asFragment).toMatchSnapshot();
});

test('navbar shows more dropdown', () => {
  const { getByText } = renderWithStore(<Navbar />);

  const moreDropdown = getByText(/more/i);
  expect(moreDropdown).toBeInTheDocument();
});
