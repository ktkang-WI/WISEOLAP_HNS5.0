import axios from 'axios';
import {useDispatch} from 'react-redux';
import LoadingSlice from 'redux/modules/LoadingSlice';

export default function useAxiosSetting() {
  const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

  const path = document.location.origin + contextRoot;
  const dispatch = useDispatch();
  const actions = LoadingSlice.actions;

  axios.defaults.baseURL = path;

  axios.interceptors.request.use(
      (config) => {
        dispatch(actions.startJob());
        return config;
      },
      (error) => {
        return error;
      }
  );

  axios.interceptors.response.use(
      (response) => {
        dispatch(actions.endJob());
        return response;
      },
      (error) => {
        dispatch(actions.endJob());
        return error;
      }
  );
};
