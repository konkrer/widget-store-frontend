import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// local imports
import NavbarCartElement from './NavbarCartEl';

test('NavbarCartEl renders', () => {
  render(
    <MemoryRouter>
      <NavbarCartElement numCartItems={5} />
    </MemoryRouter>
  );
});

test('returns NavLink to open cart normally', () => {
  const { getByRole } = render(
    <MemoryRouter>
      <NavbarCartElement numCartItems={5} />
    </MemoryRouter>
  );

  const cartLink = getByRole('link', { name: /cart/i });
  expect(cartLink).toBeInTheDocument();
});

test('does not return link to open cart on "/checkout" page', () => {
  const { queryByRole } = render(
    <MemoryRouter>
      <NavbarCartElement numCartItems={5} pathRoot="/checkout" />
    </MemoryRouter>
  );

  const cartLink = queryByRole('link', { name: /cart/i });
  expect(cartLink).not.toBeInTheDocument();
});
