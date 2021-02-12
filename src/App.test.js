import { screen, act } from '@testing-library/react';

// local imports
import { renderWithStore } from './utils/testHelpers';
import App from './App';

test('renders App', async () => {
  await act(async () => {
    renderWithStore(<App />);
  });

  const storeName = screen.getAllByText(/widget store/i);
  expect(storeName).toHaveLength(2);
});
