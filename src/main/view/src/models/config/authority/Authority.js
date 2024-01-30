import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const accountPath = document.location.origin + contextRoot + '/account';

// 데이터셋
export const getDs = async () => {
  const res = await axios.get('/dataset/ds');
  return res;
};

export const getDsViewCube = async () => {
  const res = await axios.get('/dataset/ds/dsview-cube');
  return res;
};

// 그룹
export const getGroups = async () => {
  const res = await axios.get(accountPath + '/group');
  return res;
};

// 사용자
export const getUsers = async () => {
  const res = await axios.get(accountPath + '/user');
  console.log(res.data.data);
  return res;
};

// 권한
// 그룹 데이터
export const getGroupData = async () => {
  const res = await axios.get(accountPath + '/group/data');
  return res;
};

// 사용자 데이터
export const getUserData = async () => {
  const res = await axios.get(accountPath + '/user/data');
  console.log(res.data.data);
  return res;
};


