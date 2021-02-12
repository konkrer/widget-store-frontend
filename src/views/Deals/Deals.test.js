/** Deals tests */

// local imports
import { act } from '@testing-library/react';
import { renderWithStore } from '../../utils/testHelpers';
import Deals from './Deals';

const axios = require('axios');
jest.mock('axios');

beforeEach(() => {
  axios.mockResolvedValue({
    data: {
      products: [
        {
          byline: 'Latest generation smart televison 2021',
          discount: '0.00',
          image_url:
            'https://www.lg.com/sg/images/tvs/md05271244/gallery/LG-43LH600T-L.jpg',
          name: 'Samsung XG-900 55 inch LCD TV',
          price: '400.40',
          product_id: 1,
          rating: null,
        },
      ],
    },
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders Deals', async () => {
  await act(async () => {
    renderWithStore(<Deals />);
  });
});

// snapshot with animation????
// test('Deals snapshot', async () => {
//   let asFragment;
//   await act(async () => {
//     const resp = renderWithStore(<Deals />);
//     asFragment = resp.asFragment;
//   });
//   expect(asFragment()).toMatchSnapshot();
// });

test('Product name in document', async () => {
  let getByText;
  await act(async () => {
    const resp = renderWithStore(<Deals />);
    getByText = resp.getByText;
  });
  const cardText = getByText('Samsung XG-900 55 inch LCD TV');
  expect(cardText).toBeInTheDocument();
});
