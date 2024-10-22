import axios from 'axios';
import {useDispatch} from 'react-redux';
import LoadingSlice from 'redux/modules/LoadingSlice';
import {getConfig} from 'config/config';
import useModal from './useModal';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

export let requestPath = [];

export const abortController = (controllers, session) => {
  controllers[session]?.forEach((controller) => {
    controller.abort();
  });

  if (!controllers || !controllers[session]) return;
  requestPath = requestPath.filter((path) => path !== session);
  delete controllers[session];
};

export default function useAxiosSetting() {
  const path = document.location.origin + contextRoot;
  const dispatch = useDispatch();
  const {alert} = useModal();
  const actions = LoadingSlice.actions;
  const controllers = {};

  const createController = (requestKey) => {
    requestPath.push(requestKey);

    const controller = new AbortController();

    controllers[requestKey] = [...controllers[requestKey] || [], controller];
    controllers.lastRequestKey = requestKey;
    return controller;
  };
  axios.defaults.baseURL = path;

  axios.interceptors.request.use(
      (config) => {
        if (config.url.indexOf('portal/card-data') == -1) {
          console.log(config.url, '로딩 시작');
          dispatch(actions.startJob());
        }
        return config;
      },
      (error) => {
        if (error?.response?.status == 500) {
          alert('관리자에게 문의 하세요.');
        }
        if (error?.response?.status == 404) {
          alert('관리자에게 문의 하세요.');
        }
        return error;
      }
  );

  axios.interceptors.response.use(
      (response) => {
        dispatch(actions.endJob());
        console.log(response.config.url, '로딩 끝');
        const idx =
          requestPath.findIndex((path) => path === response.config.url);
        if (idx > -1) {
          requestPath =
            requestPath.filter((_, index) => index !== idx);
        }
        return response;
      },
      (error) => {
        // 아이템 마다 에러 발생 시 여러번 alert 호출 추후변경.
        dispatch(actions.endJobForce());
        if (error.message === 'canceled') {
          requestPath = [];
        }
        // TODO: 이행 후 에러 status 세분화
        if (error?.response?.status == 500) {
          if (error?.response?.config?.url !== '/login/login') {
            alert('관리자에게 문의 하세요.');
          }
        }
        if (error?.response?.status == 404) {
          if (error?.response?.config?.url !== '/login/login') {
            alert('관리자에게 문의 하세요.');
          }
        }

        if (process.env.NODE_ENV != 'development' &&
          error?.response?.status == 401) {
          location.href = error.config.baseURL;
        }
        return Promise.reject(error);
      }
  );

  axios.interceptors.request.use((config) => {
    const requestKey = config.url;
    const controller = createController(requestKey);

    if (!controller) return config;
    config.signal = controller.signal;

    return config;
  }, (error) => {
    if (error?.response?.status == 500) {
      alert('관리자에게 문의 하세요.');
    }
    if (error?.response?.status == 404) {
      alert('관리자에게 문의 하세요.');
    }
    return Promise.reject(error);
  });

  return {
    controllers
  };
};
