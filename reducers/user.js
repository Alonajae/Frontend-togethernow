import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    token: null,
    firstname: null,
    lastname: null,
    inscriptionDate: null,
    email: null,
    password: null,
    emergencyContact: null,
    age: null,
    reasons: null,
    visibleOnMap: null,
    photoId: null,
    profilePicture: null,
    validationVideo: null,
    accessGranted: null,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerStep1: (state, action) => {
      state.value.email = action.payload.email;
      state.value.password = action.payload.password;
    },
    registerStep2: (state, action) => {
      state.value.firstname = action.payload.firstname;
      state.value.lastname = action.payload.lastname;
      state.value.emergencyContact = action.payload.emergencyContact;
      state.value.age = action.payload.age;
      state.value.reasons = action.payload.reasons;
    },
    registerStep3: (state, action) => {
      state.value.photoId = action.payload.photoId;
    },
    registerStep4: (state, action) => {
      state.value.profilePicture = action.payload.profilePicture;
    },
    registerStep5: (state, action) => {
      state.value.validationVideo = action.payload.validationVideo;
    },
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.firstname = action.payload.firstname;
      state.value.lastname = action.payload.lastname;
      state.value.inscriptionDate = action.payload.inscriptionDate;
      state.value.emergencyContact = action.payload.emergencyContact;
      state.value.age = action.payload.age;
      state.value.reasons = action.payload.reasons;
      state.value.visibleOnMap = action.payload.visibleOnMap;
      state.value.profilePicture = action.payload.profilePicture;
      state.value.accessGranted = action.payload.accessGranted;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
      state.value.firstname = null;
      state.value.lastname = null;
      state.value.inscriptionDate = null;
      state.value.emergencyContact = null;
      state.value.age = null;
      state.value.reasons = null;
      state.value.photoId = null;
      state.value.validationVideo = null;
      state.value.profilePicture = null;
      state.value.visibleOnMap = null;
      state.value.password = null;
      state.value.accessGranted = null;
    },
    clean: (state) => {
      state.value.validationVideo = null;
      state.value.photoId = null;
      state.value.password = null;
      state.value.profilePicture = null;
    },
  },
});

export const { login, registerStep1, registerStep2, registerStep3, registerStep4, registerStep5, logout, clean } = userSlice.actions;
export default userSlice.reducer;
