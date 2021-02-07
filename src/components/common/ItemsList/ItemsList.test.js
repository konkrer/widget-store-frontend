/** ItemsList tests */

import { fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// local imports
import { testStore } from '../../../redux/store/reduxStore';
import resetCart from '../../../redux/actions/cart/resetCart';
import addProduct from '../../../redux/actions/cart/addProduct';
import { renderWithStore } from '../../../helpers/testHelpers';
import { TEST_DATA, populateTestDataHook } from '../../../helpers/testConfig';
import ItemsList from './ItemsList';

let cart;

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
  // change product quantity to 2 units too
  TEST_DATA.product.quantity = 2;
});

beforeEach(() => {
  testStore.dispatch(addProduct(TEST_DATA.product));
  cart = testStore.getState().cart;
});

afterEach(() => {
  testStore.dispatch(resetCart());
});

test('renders ItemsList', async () => {
  renderWithStore(<ItemsList cart={cart} />);
});

test('ItemsList snapshot', async () => {
  const { asFragment } = renderWithStore(<ItemsList cart={cart} />);
  expect(asFragment()).toMatchSnapshot();
});

test('Product name in document', async () => {
  const { getByText } = renderWithStore(<ItemsList cart={cart} />);

  const productName = getByText('Samsung XG-900 55 inch LCD TV');
  expect(productName).toBeInTheDocument();
});

test('Product price in document', async () => {
  const { getByText } = renderWithStore(<ItemsList cart={cart} />);

  const productPrice = getByText('$400.40');
  expect(productPrice).toBeInTheDocument();
});

test('Product total price in document twice', () => {
  const { getAllByText } = renderWithStore(<ItemsList cart={cart} />);
  // item total and ItemsList subtotal are equal and both present
  const productTotal = getAllByText(/\$\s*800\.80/g);
  expect(productTotal).toHaveLength(2);
});

test('Subtotal shows combined items price with discount applied', () => {
  testStore.dispatch(addProduct(TEST_DATA.product2));
  cart = testStore.getState().cart;

  const { getByText } = renderWithStore(<ItemsList cart={cart} />);

  const subtotal = getByText(/\$\s*834\.97/g);
  expect(subtotal).toBeInTheDocument();
});

test('Incrementing product quantity changes items total and subtotal', () => {
  const { getByRole, queryAllByText, rerender } = renderWithStore(
    <ItemsList cart={cart} />
  );

  // new total not in document yet
  let newTotal = queryAllByText(/\$\s*1201\.20/g);
  expect(newTotal).toHaveLength(0);

  const incrementButton = getByRole('button', { name: 'increment button' });
  fireEvent.click(incrementButton);

  cart = testStore.getState().cart;
  rerender(
    <Provider store={testStore}>
      <MemoryRouter>{<ItemsList cart={cart} />}</MemoryRouter>
    </Provider>
  );

  // new total in document now
  newTotal = queryAllByText(/\$\s*1201\.20/g);
  expect(newTotal).toHaveLength(2);
});

test('Incrementing product quantity when disabled has no effect', () => {
  const { getByRole, queryAllByText, rerender } = renderWithStore(
    <ItemsList cart={cart} disabled="true" />
  );

  // new total not in document yet
  let newTotal = queryAllByText(/\$\s*1201\.20/g);
  expect(newTotal).toHaveLength(0);

  const incrementButton = getByRole('button', { name: 'increment button' });
  fireEvent.click(incrementButton);

  cart = testStore.getState().cart;
  rerender(
    <Provider store={testStore}>
      <MemoryRouter>{<ItemsList cart={cart} />}</MemoryRouter>
    </Provider>
  );

  // new total still not in document
  newTotal = queryAllByText(/\$\s*1201\.20/g);
  expect(newTotal).toHaveLength(0);
});

test('Decrementing product quantity changes items total and subtotal', async () => {
  const { getByRole, queryAllByText, rerender } = renderWithStore(
    <ItemsList cart={cart} />
  );
  // new total in document once already as price
  let newTotal = queryAllByText(/\$\s*400\.40/g);
  expect(newTotal).toHaveLength(1);

  const decrementButton = getByRole('button', { name: 'decrement button' });
  fireEvent.click(decrementButton);

  cart = testStore.getState().cart;
  rerender(
    <Provider store={testStore}>
      <MemoryRouter>{<ItemsList cart={cart} />}</MemoryRouter>
    </Provider>
  );

  // new total in document now 3 times (price, item total, subtotal)
  newTotal = queryAllByText(/\$\s*400\.40/g);
  expect(newTotal).toHaveLength(3);
});

test('Decrementing product quantity when disabled has no effect', async () => {
  const { getByRole, queryAllByText, rerender } = renderWithStore(
    <ItemsList cart={cart} disabled="disabled" />
  );
  // new total in document once already as price
  let newTotal = queryAllByText(/\$\s*400\.40/g);
  expect(newTotal).toHaveLength(1);

  const decrementButton = getByRole('button', { name: 'decrement button' });
  fireEvent.click(decrementButton);

  cart = testStore.getState().cart;
  rerender(
    <Provider store={testStore}>
      <MemoryRouter>{<ItemsList cart={cart} />}</MemoryRouter>
    </Provider>
  );

  // new total in document once as price
  newTotal = queryAllByText(/\$\s*400\.40/g);
  expect(newTotal).toHaveLength(1);
});

test('Removing product removes product data and changes subtotal', async () => {
  const { getByRole, queryByText, rerender } = renderWithStore(
    <ItemsList cart={cart} />
  );
  // product name in document
  let productName = queryByText('Samsung XG-900 55 inch LCD TV');
  expect(productName).toBeInTheDocument();
  // $0.00 not in document
  let zeroTotal = queryByText(/\$\s*0\.00/);
  expect(zeroTotal).not.toBeInTheDocument();

  const removeButton = getByRole('button', { name: 'remove button' });
  fireEvent.click(removeButton);

  cart = testStore.getState().cart;
  rerender(
    <Provider store={testStore}>
      <MemoryRouter>{<ItemsList cart={cart} />}</MemoryRouter>
    </Provider>
  );

  // product name not in document
  productName = queryByText('Samsung XG-900 55 inch LCD TV');
  expect(productName).not.toBeInTheDocument();
  // $0.00  in document
  zeroTotal = queryByText(/\$\s*0\.00/);
  expect(zeroTotal).toBeInTheDocument();
});

test('Removing product when disabled has no effect', async () => {
  const { getByRole, queryByText, rerender } = renderWithStore(
    <ItemsList cart={cart} disabled="disabled" />
  );
  // product name in document
  let productName = queryByText('Samsung XG-900 55 inch LCD TV');
  expect(productName).toBeInTheDocument();
  // $0.00 not in document
  let zeroTotal = queryByText(/\$\s*0\.00/);
  expect(zeroTotal).not.toBeInTheDocument();

  const removeButton = getByRole('button', { name: 'remove button' });
  fireEvent.click(removeButton);

  cart = testStore.getState().cart;
  rerender(
    <Provider store={testStore}>
      <MemoryRouter>{<ItemsList cart={cart} />}</MemoryRouter>
    </Provider>
  );

  // product name in document
  productName = queryByText('Samsung XG-900 55 inch LCD TV');
  expect(productName).toBeInTheDocument();
  // $0.00 not in document
  zeroTotal = queryByText(/\$\s*0\.00/);
  expect(zeroTotal).not.toBeInTheDocument();
});

test('shows tax and total customer data present', () => {
  const { getByText, getAllByText } = renderWithStore(
    <ItemsList
      cart={cart}
      orderData={{ customer: { state: 'CA' }, tax: '68.07', total: '868.87' }}
    />
  );

  const taxLabel = getByText(/tax/i);
  expect(taxLabel).toBeInTheDocument();

  const tax = getByText(/\$\s*68.07/);
  expect(tax).toBeInTheDocument();

  const totalLabel = getAllByText(/Total/);
  expect(totalLabel).toHaveLength(2);

  const total = getByText(/\$\s*868.87/);
  expect(total).toBeInTheDocument();
});

test('shows tax, shipping, and total when shipping data present', () => {
  const { getByText, getAllByText } = renderWithStore(
    <ItemsList
      cart={cart}
      orderData={{
        customer: { state: 'CA' },
        shipping: {
          shipping_method: 'usps_ground',
          details: {
            cost: '12.00',
            name: 'USPS Ground',
          },
        },
        tax: '68.07',
        total: '880.87',
      }}
    />
  );

  const taxLabel = getByText(/tax/i);
  expect(taxLabel).toBeInTheDocument();

  const tax = getByText(/\$\s*68.07/);
  expect(tax).toBeInTheDocument();

  const shippingLabel = getByText(/shipping/i);
  expect(shippingLabel).toBeInTheDocument();

  const shipping = getByText(/\$\s*12.00/);
  expect(shipping).toBeInTheDocument();

  const totalLabel = getAllByText(/Total/);
  expect(totalLabel).toHaveLength(2);

  const total = getByText(/\$\s*880.87/);
  expect(total).toBeInTheDocument();
});
