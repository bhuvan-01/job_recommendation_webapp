import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    jobs: [],
    // loading: false,
    // error: null,
    savedJobs: [],
    appliedJobs: [],
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
    saveJob: (state, action) => {
      const job = action.payload;
      // Ensure the job isn't already saved
      if (!state.savedJobs.find(savedJob => savedJob._id === job._id)) {
        state.savedJobs.push(job);
      }
    },

    appliedJob: (state, action) => {
      const job = action.payload;
      // Ensure the job isn't already applied
      if (!state.appliedJobs.find(appliedJob => appliedJob._id === job._id)) {
        state.appliedJobs.push(job);
      }
    },
  },
});

const { actions, reducer } = jobSlice;

export const { addJob, deleteJob, storeJobs, updateJob,saveJob, appliedJob} = actions;

export default reducer;
