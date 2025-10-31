import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import issuesReducer from '../features/issues/store/issuesSlice';
import authReducer from '../features/auth/authSlice';
import { injectStore } from '../lib/axios';

// ✅ Works in both Vite & Jest
const isDev = process.env.NODE_ENV === 'development';

export const store = configureStore({
  reducer: {
    issues: issuesReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: isDev,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

injectStore(store);
