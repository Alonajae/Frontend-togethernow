import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, email: null, password: null, confirmPassword: null },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.password = action.payload.password;
    },
    register: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.password = action.payload.password;
      state.value.confirmPassword = action.payload.confirmPassword;
    }
    // logout: (state.action) => {
    //   state.value.token = null;
    //   state.value.email = null;
    // },
  },
});

export const { login, register, logout } = userSlice.actions;
export default userSlice.reducer;
