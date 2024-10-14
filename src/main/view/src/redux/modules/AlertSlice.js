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
