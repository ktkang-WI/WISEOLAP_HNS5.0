import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isAlertShown: false
};

const reducers = {
  initAlert: () => initialState,
  showAlert: (state, action) => {
    state.isAlertShown = true;
  },
  resetAlert: (state, action) => {
    state.isAlertShown = false;
  }
};

const extraReducers = {};

const AlertSlice = createSlice({
  name: 'Alert',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default AlertSlice;

// export const alertSlice = createSlice({
//   name: 'alert',
//   initialState: {
//     isAlertShown: false,
//   },
//   reducers: {
//     showAlert: (state) => {
//       state.isAlertShown = true;
//     },
//     resetAlert: (state) => {
//       state.isAlertShown = false;
//     },
//   },
// });

// export const { showAlert, resetAlert } = alertSlice.actions;
// export default alertSlice.reducer;
