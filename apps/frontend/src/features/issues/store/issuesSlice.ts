import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '../../../lib/axios';
import type { RootState } from '../../../store';
import type { IssueFilters } from '../fetchIssues';

export interface Issue {
  id: number;
  title: string;
  description: string;
  priority: string;
  createdAt?: Date;
  status?: string;
  success?: boolean;
}

interface IssuesState {
  list: Issue[];
  loading: boolean;
  error: string | null;
  selectedIssue: Issue | null;
}

export interface Error {
  response: { data: { message: string } };
}

const initialState: IssuesState = {
  list: [],
  loading: false,
  error: null,
  selectedIssue: null,
};

export const fetchIssues = createAsyncThunk(
  'issues/fetchIssues',
  async (filters: IssueFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);

    const { data } = await axios.get(`/api/issues?${params.toString()}`);
    return data;
  }
);

// ✅ Create new issue
export const createIssue = createAsyncThunk<
  Issue,
  Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'success'>
>('issues/create', async (newIssue, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/issues', newIssue);
    return res.data;
  } catch (err) {
    return rejectWithValue(
      (err as unknown as Error).response?.data?.message || 'Failed to create issue'
    );
  }
});

// ✅ Update issue
export const updateIssue = createAsyncThunk<Issue, { id: number; data: Partial<Issue> }>(
  'issues/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/issues/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        (err as unknown as Error).response?.data?.message || 'Failed to update issue'
      );
    }
  }
);

// ✅ Delete issue
export const deleteIssue = createAsyncThunk<number, number>(
  'issues/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/issues/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        (err as unknown as Error).response?.data?.message || 'Failed to delete issue'
      );
    }
  }
);

// ---------------------------------------------
// 🧱 Slice
// ---------------------------------------------
const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    selectIssue(state, action: PayloadAction<Issue | null>) {
      state.selectedIssue = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((i) => i.id !== action.payload);
      })
      .addCase(deleteIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectIssue } = issuesSlice.actions;

export const selectIssues = (state: RootState) => state.issues.list;
export const selectIssuesLoading = (state: RootState) => state.issues.loading;
export const selectSelectedIssue = (state: RootState) => state.issues.selectedIssue;

export default issuesSlice.reducer;
