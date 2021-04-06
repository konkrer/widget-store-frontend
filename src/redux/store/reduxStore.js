/*
 * Uses redux-persist to persist state.
 * Uses redux-thunk to allow async operations.
 */

import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

// local imports
import root from '../reducers/root';

// Configure redux-persistant state storage.
const persistConfig = {
  key: 'root',
  storage,
  // allow any new state properties to persist state rehydration
  stateReconciler: autoMergeLevel2,
};

// Create a persisted reducer from root reducer.
const persistedReducer = persistReducer(persistConfig, root);

// Create store from persisted reducer.
export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

// Create persisted store.
export const persistedStore = persistStore(store);

// Also create test-store that is not persisted.
export const testStore = createStore(root);
