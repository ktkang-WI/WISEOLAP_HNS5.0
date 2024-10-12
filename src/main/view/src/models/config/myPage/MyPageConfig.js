import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const myPagePath = document.location.origin + contextRoot + '/mypage';

// 데이터셋
export const getUserInfomation = () => {
  const res = axios.get(myPagePath + '/user-info');

  return res;
};

export const addPwChangeDt = async (param) => {
  const res = axios.patch(
      myPagePath + '/add-change-pw-dt', null, {params: param}
  );

  return await res;
};

export const updatePassword = async (param) => {
  const res = axios.patch(
      myPagePath + '/user-info/update-password', null, {params: param}
  );

  return await res;
};

export const updateUserInfo = (param) => {
  const res = axios.patch(
      myPagePath + '/user-info/update-info', null, {params: param}
  );

  return res;
};

export const updateViewerConfig = (param) => {
  const res = axios.post(
      myPagePath + '/my-page-viewer-config/save', null, {params: param}
  );

  return res;
};

export const getUserNm = () => {
  const res = axios.get(myPagePath + '/get-name');

  return res;
};
