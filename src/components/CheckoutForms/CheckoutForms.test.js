import { renderWithStore } from '../../helpers/testHelpers';
import CheckoutForms from './CheckoutForms';

test('renders CheckoutForms', () => {
  renderWithStore(<CheckoutForms orderData={{}} />);
});
