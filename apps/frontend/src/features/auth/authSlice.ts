import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '../../lib/axios';
import type { RootState } from '../../store';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  user: User;
  refreshToken: string | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface Error {
  response: { data: { message: string } };
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  refreshToken: localStorage.getItem('refreshToken'),
  user: JSON.parse(localStorage.getItem('user') || 'null') || {
    name: 'No_name',
    email: 'No_Email',
    role: 'user',
    id: 0,
  },
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/auth/login', credentials);
      const { token, user, refreshToken } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, user, refreshToken };
    } catch (err) {
      return rejectWithValue((err as unknown as Error).response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        (err as unknown as Error).response?.data?.message ||
          'Registration failed. Please try again.'
      );
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const refreshToken = state.auth.refreshToken;

    if (!refreshToken) return rejectWithValue('No refresh token');

    try {
      const res = await axios.post('/api/auth/refresh', { refreshToken });
      // Make sure we extract the actual token string
      const token = res.data.token;

      if (typeof token !== 'string') {
        console.error('Expected token to be a string but got:', token);
        return rejectWithValue('Invalid token format from server');
      }

      localStorage.setItem('token', token);
      return token;
    } catch {
      return rejectWithValue('Session expired. Please log in again.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = {} as User;
      state.token = null;
      state.refreshToken = null;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ refreshToken: string; token: string; user: User }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload;
        state.error = null;
      });
  },
});

export const { logout, setToken } = authSlice.actions;

export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
