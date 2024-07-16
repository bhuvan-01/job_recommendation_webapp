import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: JSON.parse(localStorage.getItem('token')) || null,
    user: null,
    isLoading: true,
  },
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
    },
    logout(state) {
      state.token = null;
      state.user = null;
    },
    setUser(state, action) {
      state.user = action.payload.user;
    },
    startLoader(state) {
      state.isLoading = true;
    },
    stopLoader(state) {
      state.isLoading = false;
    },
  },
});

export const { login, logout, setUser, startLoader, stopLoader } =
  authSlice.actions;
export default authSlice.reducer;
