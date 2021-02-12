/** Pricing1 tests */

// local imports
import { act } from '@testing-library/react';
import { renderWithStore } from '../../../utils/testHelpers';
import Pricing1 from './Pricing1';

let product;

beforeEach(() => {
  product = {
    byline: 'Latest generation smart televison 2021',
    discount: '0.00',
    image_url:
      'https://www.lg.com/sg/images/tvs/md05271244/gallery/LG-43LH600T-L.jpg',
    name: 'Samsung XG-900 55 inch LCD TV',
    price: '400.40',
    product_id: 1,
    rating: null,
  };
});

test('renders Pricing1', () => {
  act(() => {
    renderWithStore(<Pricing1 product={product} />);
  });
});

test('Pricing1 snapshot', async () => {
  let asFragment;
  await act(async () => {
    const resp = renderWithStore(<Pricing1 product={product} />);
    asFragment = resp.asFragment;
  });
  expect(asFragment()).toMatchSnapshot();
});

test('Pricing1 w/ discount snapshot', async () => {
  product.discount = 0.15;
  let asFragment;
  await act(async () => {
    const resp = renderWithStore(<Pricing1 product={product} />);
    asFragment = resp.asFragment;
  });
  expect(asFragment()).toMatchSnapshot();
});

test('Shows sale byline w/ discount', async () => {
  product.discount = 0.15;
  let getByText;
  await act(async () => {
    const resp = renderWithStore(<Pricing1 product={product} />);
    getByText = resp.getByText;
  });
  const saleByline = getByText(/Sale \d+% OFF/);
  expect(saleByline).toBeInTheDocument();
});

test("Doesn't shows sale byline if no discount", async () => {
  let queryByText;
  await act(async () => {
    const resp = renderWithStore(<Pricing1 product={product} />);
    queryByText = resp.queryByText;
  });
  const saleByline = queryByText(/Sale \d+% OFF/);
  expect(saleByline).not.toBeInTheDocument();
});
