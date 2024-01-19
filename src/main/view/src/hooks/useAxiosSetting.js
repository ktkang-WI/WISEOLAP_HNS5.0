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
        // TODO: 로딩 증가
        dispatch(actions.startJob());
        return config;
      },
      (error) => {
        // TODO: 로딩 증가
        return error;
      }
  );

  axios.interceptors.response.use(
      (response) => {
        // TODO: 로딩 감소
        dispatch(actions.endJob());
        return response;
      },
      (error) => {
        // TODO: 로딩 감소
        dispatch(actions.endJob());
        return error;
      }
  );
};
