/** NotFoundPage tests */
import { act } from '@testing-library/react';

// local imports
import NotFoundPage from './NotFoundPage';
import { renderWithStore } from '../../utils/testHelpers';

test('renders NotFoundPage', async () => {
  await act(async () => {
    renderWithStore(<NotFoundPage />);
  });
});

test('NotFoundPage snapshot', async () => {
  let asFragment;
  await act(async () => {
    const resp = renderWithStore(<NotFoundPage />);
    asFragment = resp.asFragment;
  });
  expect(asFragment()).toMatchSnapshot();
});
