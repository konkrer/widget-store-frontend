import { render } from '@testing-library/react';
import { renderWithStore } from '../../utils/testHelpers';

// local imports
import AdminPanel from './AdminPanel';

test('AdminPanel renders', () => {
  const { queryByText } = render(<AdminPanel adminUser={true} />);

  const panelHeader = queryByText(/admin panel/i);
  expect(panelHeader).toBeInTheDocument();
});

test('AdminPanel redirects if not admin user', () => {
  const { queryByText } = renderWithStore(<AdminPanel adminUser={false} />);

  const panelHeader = queryByText(/admin panel/i);
  expect(panelHeader).not.toBeInTheDocument();
});
