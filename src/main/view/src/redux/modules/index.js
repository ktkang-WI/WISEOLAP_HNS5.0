import {configureStore, combineReducers} from '@reduxjs/toolkit';
import ConfigSlice from './ConfigSlice';
import ReportSlice from './ReportSlice';

const metaReducer = combineReducers({
  config: ConfigSlice.reducer,
  report: ReportSlice.reducer
});

const configure = {
  reducer: {
    meta: metaReducer
  }
};

const store = configureStore(configure);

if (process.env.NODE_ENV == 'development') {
  window.WI = store.getState();
}

export default store;
