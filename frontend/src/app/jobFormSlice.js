import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';

// Async thunks for CRUD operations

export const fetchAdminJobs = createAsyncThunk(
  'jobForm/fetchAdminJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin/jobs');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createAdminJob = createAsyncThunk(
  'jobForm/createAdminJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/admin/jobs', jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAdminJob = createAsyncThunk(
  'jobForm/updateAdminJob',
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAdminJob = createAsyncThunk(
  'jobForm/deleteAdminJob',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/jobs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const jobFormSlice = createSlice({
  name: 'jobForm',
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdminJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdminJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
        state.loading = false;
      })
      .addCase(createAdminJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAdminJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex((job) => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateAdminJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAdminJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteAdminJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default jobFormSlice.reducer;
