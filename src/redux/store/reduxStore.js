/*
 * Uses redux-persist to persist state.
 * Uses redux-thunk to allow async operations.
 */

import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

// local imports
import root from '../reducers/root';

const persistConfig = {
  key: 'root',
  storage,
  // allow any new state properties to persist state rehydration
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, root);

export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export const persistedStore = persistStore(store);

export const testStore = createStore(root);
