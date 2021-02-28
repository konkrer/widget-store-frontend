import { render, within } from '@testing-library/react';

// local imports
import ProductPanel from './ProductPanel';

test('ProductPanel renders child component by prop', () => {
  const props = {
    title: 'I am h1 page title',
    byline: 'I am h2 byline',
    component: <div role="alert">I am child component</div>,
  };
  const { getByRole } = render(<ProductPanel {...props} />);

  const header = getByRole('banner');
  const headerContent = within(header);
  expect(headerContent.getByText('I am h1 page title')).toBeInTheDocument();
  expect(headerContent.getByText('I am h2 byline')).toBeInTheDocument();
  expect(getByRole('alert')).toBeInTheDocument();
});

test('ProductPanel renders child component by wrapping', () => {
  const props = {
    title: 'I am h1 page title',
    byline: 'I am h2 byline',
  };
  const { getByRole } = render(
    <ProductPanel {...props}>
      <div role="alert">I am child component</div>
    </ProductPanel>
  );

  const header = getByRole('banner');
  const headerContent = within(header);
  expect(headerContent.getByText('I am h1 page title')).toBeInTheDocument();
  expect(headerContent.getByText('I am h2 byline')).toBeInTheDocument();
  expect(getByRole('alert')).toBeInTheDocument();
});
