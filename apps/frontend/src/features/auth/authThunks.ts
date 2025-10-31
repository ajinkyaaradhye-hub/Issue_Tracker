import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Error } from './authSlice';

export const loginUser = createAsyncThunk<
  string,
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/login', formData);
    const token = res.data.token;
    localStorage.setItem('token', token);
    return token;
  } catch (err) {
    const message = (err as unknown as Error).response?.data?.message || 'Login failed';
    return rejectWithValue(message);
  }
});
