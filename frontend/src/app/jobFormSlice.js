import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';

export const fetchAdminJobs = createAsyncThunk(
  'jobForm/fetchAdminJobs',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching jobs...');
      const response = await apiClient.get('/jobs');
      console.log('Fetched Jobs:', response.data);
      return response.data.jobs;
    } catch (error) {
      console.error('Fetch Jobs Error:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Unknown error occurred'
      );
    }
  }
);

export const createAdminJob = createAsyncThunk(
  'jobForm/createAdminJob',
  async (jobData, { rejectWithValue }) => {
    try {
      console.log('Creating job with data:', jobData);
      const response = await apiClient.post('/jobs', jobData);
      console.log('Created Job:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create Job Error:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Unknown error occurred'
      );
    }
  }
);

export const updateAdminJob = createAsyncThunk(
  'jobForm/updateAdminJob',
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      console.log('Updating job with ID:', id, 'and data:', jobData);
      const response = await apiClient.put(`/jobs/${id}`, jobData);
      console.log('Updated Job:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update Job Error:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Unknown error occurred'
      );
    }
  }
);

export const deleteAdminJob = createAsyncThunk(
  'jobForm/deleteAdminJob',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Deleting job with ID:', id);
      await apiClient.delete(`/jobs/${id}`);
      console.log('Deleted Job ID:', id);
      return id;
    } catch (error) {
      console.error('Delete Job Error:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Unknown error occurred'
      );
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
      // Fetch Jobs
      .addCase(fetchAdminJobs.pending, (state) => {
        console.log('Fetching jobs: Pending...');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminJobs.fulfilled, (state, action) => {
        console.log('Fetching jobs: Fulfilled:', action.payload);
        state.jobs = action.payload; 
        state.loading = false;
      })
      .addCase(fetchAdminJobs.rejected, (state, action) => {
        console.error('Fetching jobs: Rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // Create Job
      .addCase(createAdminJob.pending, (state) => {
        console.log('Creating job: Pending...');
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminJob.fulfilled, (state, action) => {
        console.log('Creating job: Fulfilled:', action.payload);
        state.jobs.push(action.payload);
        state.loading = false;
      })
      .addCase(createAdminJob.rejected, (state, action) => {
        console.error('Creating job: Rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // Update Job
      .addCase(updateAdminJob.pending, (state) => {
        console.log('Updating job: Pending...');
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminJob.fulfilled, (state, action) => {
        console.log('Updating job: Fulfilled:', action.payload);
        const index = state.jobs.findIndex((job) => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateAdminJob.rejected, (state, action) => {
        console.error('Updating job: Rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Job
      .addCase(deleteAdminJob.pending, (state) => {
        console.log('Deleting job: Pending...');
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminJob.fulfilled, (state, action) => {
        console.log('Deleting job: Fulfilled:', action.payload);
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteAdminJob.rejected, (state, action) => {
        console.error('Deleting job: Rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default jobFormSlice.reducer;
