/** CartItem tests */

import { MemoryRouter } from 'react-router-dom';

// local imports
import { fireEvent, render } from '@testing-library/react';
import { TEST_DATA, populateTestDataHook } from '../../../../utils/testConfig';
import CartItem from './CartItem';

let handleIncrement, handleDecrement, handleRemove;

beforeAll(() => {
  populateTestDataHook(TEST_DATA);
  // change product quantity to 2 units
  TEST_DATA.product.quantity = 2;
});

beforeEach(() => {
  handleIncrement = jest.fn();
  handleDecrement = jest.fn();
  handleRemove = jest.fn();
});

test('renders CartItem', async () => {
  render(
    <MemoryRouter>
      <CartItem
        item={TEST_DATA.product}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        handleRemove={handleRemove}
      />
    </MemoryRouter>
  );
});

test('CartItem snapshot', async () => {
  const { asFragment } = render(
    <MemoryRouter>
      <CartItem
        item={TEST_DATA.product}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        handleRemove={handleRemove}
      />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

test('Name, price, and total data in document', async () => {
  const { getByText } = render(
    <MemoryRouter>
      <CartItem
        item={TEST_DATA.product}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        handleRemove={handleRemove}
      />
    </MemoryRouter>
  );

  const productName = getByText(/Samsung XG-900 55 inch LCD TV/);
  expect(productName).toBeInTheDocument();

  const price = getByText(/400.40/);
  expect(price).toBeInTheDocument();

  const total = getByText(/800.80/);
  expect(total).toBeInTheDocument();
});

test('clicking increment calls handleIncrement', async () => {
  const { getByRole } = render(
    <MemoryRouter>
      <CartItem
        item={TEST_DATA.product}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        handleRemove={handleRemove}
      />
    </MemoryRouter>
  );
  expect(handleIncrement.mock.calls.length).toBe(0);

  const incrementQuantBtn = getByRole('button', { name: 'increment button' });
  fireEvent.click(incrementQuantBtn);

  expect(handleIncrement.mock.calls.length).toBe(1);
  expect(handleIncrement.mock.calls[0][0]).toBe(1);
});

test('clicking decrement calls handleDecrement', async () => {
  const { getByRole } = render(
    <MemoryRouter>
      <CartItem
        item={TEST_DATA.product}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        handleRemove={handleRemove}
      />
    </MemoryRouter>
  );
  expect(handleDecrement.mock.calls.length).toBe(0);

  const decrementQuantBtn = getByRole('button', { name: 'decrement button' });
  fireEvent.click(decrementQuantBtn);

  expect(handleDecrement.mock.calls.length).toBe(1);
  expect(handleDecrement.mock.calls[0][0]).toBe(1);
});

test('clicking remove calls handleRemove', async () => {
  const { getByRole } = render(
    <MemoryRouter>
      <CartItem
        item={TEST_DATA.product}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        handleRemove={handleRemove}
      />
    </MemoryRouter>
  );
  expect(handleRemove.mock.calls.length).toBe(0);

  const removeQuantBtn = getByRole('button', { name: 'remove button' });
  fireEvent.click(removeQuantBtn);

  expect(handleRemove.mock.calls.length).toBe(1);
  expect(handleRemove.mock.calls[0][0]).toBe(1);
});
