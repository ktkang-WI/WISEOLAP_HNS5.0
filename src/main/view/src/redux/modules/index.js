import {configureStore, combineReducers} from '@reduxjs/toolkit';
import ConfigSlice from './ConfigSlice';
import ReportSlice from './ReportSlice';
import ModalSlice from './ModalSlice';

const metaReducer = combineReducers({
  config: ConfigSlice.reducer,
  report: ReportSlice.reducer
});

const systemReducer = combineReducers({
  modal: ModalSlice.reducer
});

const configure = {
  reducer: {
    meta: metaReducer,
    system: systemReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
};

const store = configureStore(configure);

if (process.env.NODE_ENV == 'development') {
  window.WI = store;
}

export default store;
