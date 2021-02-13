/** ProductCard tests */

// local imports
import { renderWithStore } from '../../utils/testHelpers';
import { TEST_DATA, populateTestDataHook } from '../../utils/testConfig';
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

  const productByline = getByText('Latest generation smart televison 2021');
  expect(productByline).toBeInTheDocument();

  const price = getByText(/400.40/);
  expect(price).toBeInTheDocument();

  const img = getByAltText(TEST_DATA.product.name);
  expect(img).toBeInTheDocument();
});

test('Omits product byline if name is longer than 30 chars', async () => {
  TEST_DATA.product.name = 'x'.repeat(61);
  const { queryByText } = renderWithStore(
    <ProductCard product={TEST_DATA.product} />
  );

  const productByline = queryByText('Latest generation smart televison 2021');
  expect(productByline).not.toBeInTheDocument();
});
