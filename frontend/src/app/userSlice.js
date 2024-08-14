import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/services/apiClient';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await apiClient.get('/admin/users');
  return response.data.users;
});

export const createUser = createAsyncThunk('users/createUser', async (user) => {
  const response = await apiClient.post('/admin/users', user);
  return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, data }) => {
  const response = await apiClient.put(`/admin/users/${id}`, data);
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await apiClient.delete(`/admin/users/${id}`);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    entities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.entities = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.entities.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.entities.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.entities[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.entities = state.entities.filter(user => user.id !== action.payload);
      });
  }
});

export default usersSlice.reducer;
