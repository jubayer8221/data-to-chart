'use client';

import { configureStore } from '@reduxjs/toolkit';
// import chartReducer from './chartSlice';
// import exportReducer from './exportSlice';
// import chartThemeSlice from './exportSlice';
// import recentOrderReducer from './recentOrderSlice';
// import dataReducer from './dataSlice';
import convertDataSlice from './slices/convertDataSlice'
// import printReducer from './printSlice';
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    // charts: chartReducer,
    // export: exportReducer,
    // chartsTheme: chartThemeSlice,
    // recentOrders: recentOrderReducer,
    data: convertDataSlice,
    // printData: printReducer,
  },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;