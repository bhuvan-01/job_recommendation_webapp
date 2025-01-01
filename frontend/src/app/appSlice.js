import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  keywordQuery: '',
  cityQuery: '',
  locationQuery: '',
  searchResults: [],
  selectedExperienceLevels: [],
  selectedJobTypes: [],
  selectedLocationTypes: [],
  selectedIndustries: [],
  searchResultsLoading: false,
  searchResultsError: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    keywordQueryChanged: (state, action) => {
      state.keywordQuery = action.payload;
    },
    cityQueryChanged: (state, action) => {
      state.cityQuery = action.payload;
    },
    locationQueryChanged: (state, action) => {
      state.locationQuery = action.payload;
    },
    searchResultsRequested: (state) => {
      state.searchResultsLoading = true;
      state.searchResultsError = false;
    },
    searchResultsReceived: (state, action) => {
      state.searchResultsLoading = false;
      state.searchResults = action.payload;
    },
    searchResultsRequestFailed: (state) => {
      state.searchResultsLoading = false;
      state.searchResultsError = true;
    },
    resetSearchState: (state) => {
      state.keywordQuery = '';
      state.cityQuery = '';
      state.locationQuery = '';
      state.searchResults = [];
      state.searchResultsLoading = false;
      state.searchResultsError = false;
      state.selectedExperienceLevels = [];
      state.selectedJobTypes = [];
      state.selectedLocationTypes = [];
      state.selectedIndustries = [];
    },
    selectedExperienceLevelsChanged: (state, action) => {
      state.selectedExperienceLevels = action.payload;
    },
    selectedJobTypesChanged: (state, action) => {
      state.selectedJobTypes = action.payload;
    },
    selectedLocationTypesChanged: (state, action) => {
      state.selectedLocationTypes = action.payload;
    },
    selectedIndustriesChanged: (state, action) => {
      state.selectedIndustries = action.payload;
    },
  },
});

const { actions, reducer } = appSlice;

export const {
  keywordQueryChanged,
  cityQueryChanged,
  locationQueryChanged,
  searchResultsRequested,
  searchResultsReceived,
  searchResultsRequestFailed,
  resetSearchState,
  selectedExperienceLevelsChanged,
  selectedJobTypesChanged,
  selectedLocationTypesChanged,
  selectedIndustriesChanged,
} = actions;

export default reducer;
