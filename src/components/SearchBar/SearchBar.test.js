import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// local imports
import SearchBar from './SearchBar';

const setParams = jest.fn();
window.scrollTo = jest.fn();

afterEach(() => {
  jest.resetAllMocks();
});

test('SearchBar shoud render', () => {
  const props = {
    initFormState: {},
    setParams,
  };

  render(<SearchBar {...props} />);
});

test('Category passed in initFormState gets passed to setParams', () => {
  const props = {
    initFormState: {
      category: 'newProducts',
    },
    setParams,
  };
  const { getByRole } = render(<SearchBar {...props} />);

  // test category gets passed with search button click
  userEvent.click(getByRole('button', { name: /search/i }));
  expect(setParams).toHaveBeenCalledTimes(1);
  const params = setParams.mock.calls[0][0];
  expect(params).toHaveProperty('category');
  expect(params.category).toBe('newProducts');

  // test category get passed with sort selection
  userEvent.click(getByRole('button', { name: /sorting options/i }));
  userEvent.click(getByRole('button', { name: /price high to low/i }));
  expect(setParams).toHaveBeenCalledTimes(2);
  const params2 = setParams.mock.calls[1][0];
  expect(params2).toHaveProperty('category');
  expect(params2.category).toBe('newProducts');
});

test('search term gets passed to setParams', () => {
  const props = {
    initFormState: {},
    setParams,
  };
  const { getByRole } = render(<SearchBar {...props} />);
  // enter text in search bar
  userEvent.type(
    getByRole('textbox', { name: 'search query term' }),
    'best widget'
  );
  // click search, expect query to be in params
  userEvent.click(getByRole('button', { name: /search/i }));
  expect(setParams).toHaveBeenCalledTimes(1);
  const params = setParams.mock.calls[0][0];
  expect(params).toHaveProperty('query');
  expect(params.query).toBe('best widget');
});

test('sort terms get passed to setParams', () => {
  const props = {
    initFormState: {},
    setParams,
  };
  const { getByRole } = render(<SearchBar {...props} />);

  // open sort menu and click sort option
  userEvent.click(getByRole('button', { name: /sorting options/i }));
  userEvent.click(getByRole('button', { name: /price low to high/i }));

  // expect sort data to be in params
  expect(setParams).toHaveBeenCalledTimes(1);
  const params = setParams.mock.calls[0][0];
  expect(params).toHaveProperty('order_by');
  expect(params.order_by).toBe('price');
  expect(params).toHaveProperty('order_by_sort');
  expect(params.order_by_sort).toBe('asc');
});

test('displays correct sort display', () => {
  const props = {
    initFormState: {},
    setParams,
  };
  const { getByRole, getByText } = render(<SearchBar {...props} />);

  // open sort menu and click price up sort option
  userEvent.click(getByRole('button', { name: /sorting options/i }));
  userEvent.click(getByRole('button', { name: /price low to high/i }));
  // sort info should be in document
  let filterDisplay = getByText(/price low to high/i);
  expect(filterDisplay).toBeInTheDocument();

  // open sort menu and click price down sort option
  userEvent.click(getByRole('button', { name: /sorting options/i }));
  userEvent.click(getByRole('button', { name: /price high to low/i }));
  // sort info should be in document
  filterDisplay = getByText(/price high to low/i);
  expect(filterDisplay).toBeInTheDocument();

  // open sort menu and click rating up sort option
  userEvent.click(getByRole('button', { name: /sorting options/i }));
  userEvent.click(getByRole('button', { name: /rating low to high/i }));
  // sort info should be in document
  filterDisplay = getByText(/rating low to high/i);
  expect(filterDisplay).toBeInTheDocument();

  // open sort menu and click rating down sort option
  userEvent.click(getByRole('button', { name: /sorting options/i }));
  userEvent.click(getByRole('button', { name: /rating high to low/i }));
  // sort info should be in document
  filterDisplay = getByText(/rating high to low/i);
  expect(filterDisplay).toBeInTheDocument();

  // open sort menu and click name up sort option
  userEvent.click(getByRole('button', { name: /sorting options/i }));
  userEvent.click(getByRole('button', { name: /name a to z/i }));
  // sort info should be in document
  filterDisplay = getByText(/name a to z/i);
  expect(filterDisplay).toBeInTheDocument();

  // open sort menu and click name down sort option
  userEvent.click(getByRole('button', { name: /sorting options/i }));
  userEvent.click(getByRole('button', { name: /name z to a/i }));
  // sort info should be in document
  filterDisplay = getByText(/name z to a/i);
  expect(filterDisplay).toBeInTheDocument();
});

test('reset sort clears sort params and sort display', () => {
  const props = {
    initFormState: {},
    setParams,
  };
  const { getByRole, queryByText } = render(<SearchBar {...props} />);

  // open sort menu and click price up sort option
  userEvent.click(getByRole('button', { name: /sorting options/i }));
  userEvent.click(getByRole('button', { name: /price low to high/i }));
  // sort info should be in document
  let filterDisplay = queryByText(/price low to high/i);
  expect(filterDisplay).toBeInTheDocument();

  // open sort menu and click reset
  userEvent.click(getByRole('button', { name: /sorting options/i }));
  userEvent.click(getByRole('button', { name: /reset/i }));
  // sort info should not be in document
  filterDisplay = queryByText(/price low to high/i);
  expect(filterDisplay).not.toBeInTheDocument();

  // expect sort data not to be in params
  expect(setParams).toHaveBeenCalledTimes(2);
  const params = setParams.mock.calls[1][0];
  expect(params).toHaveProperty('order_by');
  expect(params.order_by).toBe('');
  expect(params).toHaveProperty('order_by_sort');
  expect(params.order_by_sort).toBe('');
});
