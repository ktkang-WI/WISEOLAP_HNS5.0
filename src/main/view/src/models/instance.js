import axios from 'axios';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const path = document.location.origin + contextRoot;

const instance = axios.create({
  baseURL: path
});

instance.interceptors.request.use(
    (config) => {
      // TODO: 로딩 증가
      return config;
    },
    (error) => {
      // TODO: 로딩 증가
      return error;
    }
);

instance.interceptors.response.use(
    (response) => {
      // TODO: 로딩 감소
      return response;
    },
    (error) => {
      // TODO: 로딩 감소
      return error;
    }
);

export default instance;
