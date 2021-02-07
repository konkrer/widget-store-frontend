/** ProductCard tests */

// local imports
import { renderWithStore } from '../../helpers/testHelpers';
import { TEST_DATA, populateTestDataHook } from '../../helpers/testConfig';
import ProductCard from './ProductCard';

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
});

test('renders ProductCard', async () => {
  renderWithStore(<ProductCard product={TEST_DATA.product} />);
});

test('ProductCard snapshot', async () => {
  const { asFragment } = renderWithStore(
    <ProductCard product={TEST_DATA.product} />
  );
  expect(asFragment()).toMatchSnapshot();
});

test('Name, price, and image element in document', async () => {
  const { getByText, getByAltText } = renderWithStore(
    <ProductCard product={TEST_DATA.product} />
  );

  const productName = getByText('Samsung XG-900 55 inch LCD TV');
  expect(productName).toBeInTheDocument();

  const price = getByText(/400.40/);
  expect(price).toBeInTheDocument();

  const img = getByAltText(TEST_DATA.product.name);
  expect(img).toBeInTheDocument();
});
