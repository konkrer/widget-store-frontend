// local imports
import { renderWithStore } from '../../helpers/testHelpers';
import { TEST_DATA, populateTestDataHook } from '../../helpers/testConfig';
import { testStore } from '../../redux/store/reduxStore';
import addProduct from '../../redux/actions/cart/addProduct';
import Checkout from './Checkout';

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
  testStore.dispatch(addProduct(TEST_DATA.product));
});

test('renders Checkout', () => {
  renderWithStore(<Checkout />);
});

test('snapshot', async () => {
  const { asFragment } = renderWithStore(<Checkout />);
  expect(asFragment()).toMatchSnapshot();
});