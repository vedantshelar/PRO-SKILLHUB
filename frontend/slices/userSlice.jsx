import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../src/axiosInstance';


//Async thunk to fetch user data
const fetchUser = createAsyncThunk('users/fetchUsers', async () => {
    const api = axiosInstance();
    const res = await api.get('/user/currUser');
    if(res.data.error){
        return null;
    }else{
        return res.data;
    }
  });

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state){
      state.user=null;
      state.loading=false;
      state.error=null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
})

const {logout} = userSlice.actions;
const userReducer = userSlice.reducer;
export {userReducer,fetchUser,logout};