'use client';

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import dataReducer from './slices/convertDataSlice';
import exportReducer from './slices/exportSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['data'],
};

const persistedReducer = persistReducer(persistConfig, dataReducer);

export const store = configureStore({
  reducer: {
    data: persistedReducer,
    export: exportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Initialize persistor only on client-side
export const persistor = typeof window !== 'undefined' ? persistStore(store) : null;