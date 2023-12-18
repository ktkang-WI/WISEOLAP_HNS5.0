import {configureStore, combineReducers} from '@reduxjs/toolkit';
import ConfigSlice from './ConfigSlice';
import ReportSlice from './ReportSlice';
import ModalSlice from './ModalSlice';
import DatasetSlice from './DatasetSlice';
import LayoutSlice from './LayoutSlice';
import ItemSlice from './ItemSlice';
import PopoverSlice from './PopoverSlice';
import ParameterSlice from './ParameterSlice';

const metaReducer = combineReducers({
  config: ConfigSlice.reducer,
  report: ReportSlice.reducer,
  dataset: DatasetSlice.reducer,
  layout: LayoutSlice.reducer,
  item: ItemSlice.reducer,
  parameter: ParameterSlice.reducer
});

const systemReducer = combineReducers({
  modal: ModalSlice.reducer,
  popover: PopoverSlice.reducer
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
