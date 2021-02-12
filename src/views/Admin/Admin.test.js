/** Admin tests */
import { act } from '@testing-library/react';

// local imports
import Admin from './Admin';
import { renderWithStore } from '../../utils/testHelpers';

test('renders Admin', async () => {
  await act(async () => {
    renderWithStore(<Admin />);
  });
});

// test('Admin snapshot', async () => {
//   let asFragment;
//   await act(async () => {
//     const resp = renderWithStore(<Admin />);
//     asFragment = resp.asFragment;
//   });
//   expect(asFragment()).toMatchSnapshot();
// });
