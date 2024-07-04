import axios from 'axios';
import {useDispatch} from 'react-redux';
import LoadingSlice from 'redux/modules/LoadingSlice';
import {getConfig} from 'config/config';

const contextRoot =
process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

// 작업취소가 가능한 path
export const sessionKey = [
  '/report/item-data',
  '/dataset/query-dataset-tables'
];

export default function useAxiosSetting() {
  const path = document.location.origin + contextRoot;
  const dispatch = useDispatch();
  const actions = LoadingSlice.actions;
  const controllers = {};

  const createController = (requestKey) => {
    const controller = new AbortController();
    controllers[requestKey] = controller;
    return controller;
  };
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

        if (process.env.NODE_ENV != 'development' &&
          error?.response?.status == 401) {
          location.href = error.config.baseURL;
        }
        return error;
      }
  );

  axios.interceptors.request.use((config) => {
    sessionKey.forEach((session) => {
      if (!controllers.hasOwnProperty(session)) return;
      controllers[session].abort();
      delete controllers[session];
    });
    const requestKey = config.url;
    const controller = createController(requestKey);
    config.signal = controller.signal;

    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return {
    controllers
  };
};
