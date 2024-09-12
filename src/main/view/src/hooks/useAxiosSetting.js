import axios from 'axios';
import {useDispatch} from 'react-redux';
import LoadingSlice from 'redux/modules/LoadingSlice';
import {getConfig} from 'config/config';

const contextRoot =
process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');
let isCancel = false;
export let requestPath = [];
const acceptDuple = [
  '/dataset/param-list-items',
  '/report/item-data'
];
export const abortController = (controllers, session) => {
  controllers[session]?.forEach((controller) => {
    controller.abort();
  });

  if (!controllers || !controllers[session]) return;
  isCancel = true;
  requestPath = requestPath.filter((path) => path !== session);
  delete controllers[session];
};

export default function useAxiosSetting() {
  const path = document.location.origin + contextRoot;
  const dispatch = useDispatch();
  const actions = LoadingSlice.actions;
  const controllers = {};

  const createController = (requestKey) => {
    // 무한 로딩의 가능성이 있어서
    // /dataset/param-list-items 처럼 여러번 호출 가능한 부분은 작업 취소시 전부 취소 해줘야함.
    // TODO : 언급한데로 여러번 호출 가능성이 있는 path는 따로 추가 하여 조건에 추가 할 예정.
    if (requestPath.includes(requestKey) &&
    !acceptDuple.includes(requestKey)) return;
    requestPath.push(requestKey);

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
    if (requestKey === '/report/item-data' && isCancel) {
      abortController(controllers, requestKey);
      isCancel = false;
    }
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
