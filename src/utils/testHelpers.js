import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { testStore } from '../redux/store/reduxStore';

/** renderWithStore()
 *
 * Replacement function for @tesing-library/react.render() function.
 * Use when a redux store is needed for component mounting.
 *
 */

export const renderWithStore = component =>
  render(
    <Provider store={testStore}>
      <MemoryRouter>{component}</MemoryRouter>
    </Provider>
  );
