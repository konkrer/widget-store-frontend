import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { testStore } from '../redux/store/reduxStore';

export const renderWithStore = component =>
  render(
    <Provider store={testStore}>
      <MemoryRouter>{component}</MemoryRouter>
    </Provider>
  );
