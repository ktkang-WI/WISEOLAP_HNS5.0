import axios from 'axios';
import {useDispatch} from 'react-redux';
import LoadingSlice from 'redux/modules/LoadingSlice';
import {getConfig} from 'config/config';

const contextRoot =
process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

// 작업취소가 가능한 path
const requestPathMode = {
  'executeItem': '/report/item-data'
};
export const requestPath = [
  '/report/item-data'
];

export const abortController = (controllers, session) => {
  controllers[session].forEach((controller) => {
    controller.abort();
  });
  delete controllers[session];
};

export default function useAxiosSetting() {
  const path = document.location.origin + contextRoot;
  const dispatch = useDispatch();
  const actions = LoadingSlice.actions;
  const controllers = {};
  const createController = (requestKey) => {
    const executeItem =
      requestPath.find((path) => path === requestPathMode.executeItem);
    if (
      controllers?.lastRequestKey === executeItem &&
      requestKey !== executeItem
    ) {
      abortController(controllers, executeItem);
      controllers.lastRequestKey = null;
    }
    if (!requestPath.includes(requestKey)) return;
    const controller = new AbortController();

    controllers[requestKey] = [...controllers[requestKey] || [], controller];
    controllers.lastRequestKey = requestKey;
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
    const requestKey = config.url;
    const controller = createController(requestKey);
    if (!controller) return config;
    config.signal = controller.signal;

    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return {
    controllers
  };
};
