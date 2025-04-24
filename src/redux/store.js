// src/redux/store.js
'use client';

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import dataReducer from './slices/convertDataSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['data']
};

const persistedReducer = persistReducer(persistConfig, dataReducer);

export const store = configureStore({
  reducer: {
    data: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);