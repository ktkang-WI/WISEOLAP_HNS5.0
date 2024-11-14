import axios from 'axios';
import {useDispatch} from 'react-redux';
import LoadingSlice from 'redux/modules/LoadingSlice';
import {getConfig} from 'config/config';
import useModal from './useModal';
import serverErrorUtility from 'components/utils/ServerErrorUtility';
import {ErrorMessageUtil as errorMessageUtil, initParams, newMsg, newServerMsg}
  from 'components/utils/ErrorMessageUtil';

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
  const dispatch = useDispatch();
  const {alert, detailMsgAlert} = useModal();
  const path = document.location.origin + contextRoot;
  const actions = LoadingSlice.actions;
  const controllers = {};

  const removeRequestPath = (urlPath) => {
    const idx =
      requestPath.findIndex((path) => path === urlPath);
    if (idx > -1) {
      requestPath =
        requestPath.filter((_, index) => index !== idx);
    }
  };

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
        if (config.url.indexOf('card-data') == -1) {
          dispatch(actions.startJob());
        }
        return config;
      },
      (error) => {
        // TODO: 추후 알림창 한번에 처리 및 error status에 따른 세분화.
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
        // TODO : controller도 제거?
        const cnt = requestPath.length;
        dispatch(actions.endJob());

        if (cnt === 1) {
          if (newServerMsg) {
            detailMsgAlert(newMsg, newServerMsg);
            initParams(requestPath);
          } else if (newMsg) {
            alert(newMsg);
            initParams(requestPath);
          }
        }

        removeRequestPath(response.config.url);
        return response;
      },
      (error) => {
        const cnt = requestPath.length;
        const url = error?.response?.config?.url;

        dispatch(actions.endJobForce());

        if (error.code === 'ERR_CANCELED') {
          requestPath = [];
        } else {
          const {errorMsg, serverDetailMsg} = serverErrorUtility(error);
          const messages =
            errorMessageUtil(errorMsg, serverDetailMsg, cnt);

          if (messages?.newServerMsg) {
            detailMsgAlert(messages.newMsg, messages.newServerMsg);
            initParams(requestPath);
          } else if (messages?.newMsg) {
            alert(messages.newMsg);
            initParams(requestPath);
          }
        }

        removeRequestPath(url);

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
    // TODO: 추후 알림창 한번에 처리 및 error status에 따른 세분화.
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
