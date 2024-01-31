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

export const getGroupFolder = async () => {
  const res = await axios.get(accountPath + '/group/folder');
  return res.data;
};

export const getGroupDataset = async () => {
  const res = await axios.get(accountPath + '/group/dataset');
  return res.data;
};

export const getGroupDs = async () => {
  const res = await axios.get(accountPath + '/group/ds');
  return res.data;
};

// 사용자
export const getUsers = async () => {
  const res = await axios.get(accountPath + '/user');
  return res;
};

export const getUserFolder = async () => {
  const res = await axios.get(accountPath + '/user/folder');
  return res.data;
};

export const getUserDataset = async () => {
  const res = await axios.get(accountPath + '/user/dataset');
  return res.data;
};

export const getUserDs = async () => {
  const res = await axios.get(accountPath + '/user/ds');
  return res.data;
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
  return res;
};

export const getFolders = async () => {
  const res = await axios.get('config/folder');
  return res;
};

export const getFolderDatasets = async () => {
  const res = await axios.get('config/folder/dataset');
  return res;
};

