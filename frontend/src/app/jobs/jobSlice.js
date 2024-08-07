import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    jobs: [],
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
    jobApplied: (state, action) => {
      const jobIndex = state.jobs.findIndex(
        (job) => job._id === action.payload.jobId
      );
      if (jobIndex !== -1) {
        const job = state.jobs[jobIndex];
        if (!job.applications.some((app) => app.user === action.payload.user)) {
          job.applications.push({
            application: action.payload.application,
            user: action.payload.user,
          });
        }
      }
    },
    jobSaved: (state, action) => {
      const jobIndex = state.jobs.findIndex(
        (job) => job._id === action.payload.jobId
      );
      if (jobIndex !== -1) {
        const job = state.jobs[jobIndex];
        if (!job.savedBy.includes(action.payload.userId)) {
          job.savedBy.push(action.payload.userId);
        }
      }
    },
    removeJobSaved: (state, action) => {
      const jobIndex = state.jobs.findIndex(
        (job) => job._id === action.payload.jobId
      );
      if (jobIndex !== -1) {
        const job = state.jobs[jobIndex];
        job.savedBy = job.savedBy.filter(
          (userId) => userId !== action.payload.userId
        );
      }
    },
  },
});

const { actions, reducer } = jobSlice;

export const {
  addJob,
  deleteJob,
  storeJobs,
  updateJob,
  jobApplied,
  jobSaved,
  removeJobSaved,
} = actions;

export default reducer;
