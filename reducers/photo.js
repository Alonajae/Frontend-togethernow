import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  value: { photo: [] },
};

export const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {
    addPhoto: (state, action) => {
      state.value.photo.push(action.payload);
    },
    removePhoto: (state, action) => {
      state.value.photo = state.value.photo.filter((data) => data !== action.payload);
    },
  },
});

export const { addPhoto, removePhoto } = photoSlice.actions;
export default photoSlice.reducer;
