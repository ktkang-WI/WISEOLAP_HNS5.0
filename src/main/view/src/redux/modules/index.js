import {configureStore, combineReducers} from '@reduxjs/toolkit';
import ConfigSlice from './ConfigSlice';
import ReportSlice from './ReportSlice';
import ModalSlice from './ModalSlice';
import DatasetSlice from './DatasetSlice';
import LayoutSlice from './LayoutSlice';
import ItemSlice from './ItemSlice';
import PopoverSlice from './PopoverSlice';
import ParameterSlice from './ParameterSlice';
import SpreadSlice from './SpreadSlice';
import LoadingSlice from './LoadingSlice';
import LinkSlice from './LinkSlice';

const metaReducer = combineReducers({
  config: ConfigSlice.reducer,
  report: ReportSlice.reducer,
  dataset: DatasetSlice.reducer,
  layout: LayoutSlice.reducer,
  item: ItemSlice.reducer,
  parameter: ParameterSlice.reducer,
  spread: SpreadSlice.reducer,
  link: LinkSlice.reducer
});

const systemReducer = combineReducers({
  modal: ModalSlice.reducer,
  popover: PopoverSlice.reducer,
  loading: LoadingSlice.reducer
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

export const getReportInitialState = () => ReportSlice.getInitialState();

export default store;
