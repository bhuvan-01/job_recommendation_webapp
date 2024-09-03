import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/apiClient";

export const deleteUserAccount = createAsyncThunk(
  "auth/deleteUserAccount",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await apiClient.delete(`/users/delete`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      dispatch(logout());
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: JSON.parse(localStorage.getItem("token")) || null,
    user: null,
    isLoading: true,
    deleteError: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isLoading = false;
        state.deleteError = null;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.deleteError = action.payload;
      })
      .addCase(deleteUserAccount.pending, (state) => {
        state.isLoading = true;
        state.deleteError = null;
      });
  },
});

export const { login, logout, setUser, startLoader, stopLoader } =
  authSlice.actions;
export default authSlice.reducer;
