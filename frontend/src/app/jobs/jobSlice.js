import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    jobs: [],
    // loading: false,
    // error: null,
  },
  reducers: {
    addJob: (state, action) => {
      state.jobs.push(action.payload);
    },
    storeJobs: (state, action) => {
      state.jobs = action.payload;
    },
    deleteJob: (state, action) => {
      state.jobs = state.jobs.filter((job) => job._id !== action.payload);
    },
    updateJob: (state, action) => {
      const index = state.jobs.findIndex(
        (job) => job._id === action.payload._id
      );
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    },
  },
});

const { actions, reducer } = jobSlice;

export const { addJob, deleteJob, storeJobs, updateJob } = actions;

export default reducer;
