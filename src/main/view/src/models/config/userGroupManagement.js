import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const path = document.location.origin + contextRoot + '/config';

export const getGeneralConfig = async () => {
  const res = await axios.get(path + '/general');
  return res;
};

export const getUserGroupManagement = async () => {
  const res = await axios.get(path + '/usergroup');
  return res;
};

const body = {
  grpMemberUser: [
    {userNo: 2207, userId: 'adsasdasd', userNm: 'adsasdasd'}
  ]
};

const params = {
  grpNm: '20241115그룹생성',
  grpDesc: '',
  grpRunMode: 'ADMIN',
  grpMemberUser: 'grpMemberUser'
};

const paramsForUpdate = {
  grpId: 1325,
  grpNm: 'UPDATE했습니다.2',
  grpDesc: '',
  grpRunMode: '',
  grpMemberUser: 'grpMemberUser'
};

const paramsForDelete = {
  grpId: 1325
};

export const getUserGroupManagementTEST = async () => {
  const res = await axios.post(path + '/group',
      body,
      {
        params
      });
  return res;
};

export const updateGroupTest = async () => {
  const res = await axios.patch(path + '/group',
      body,
      {
        params: paramsForUpdate
      });
  return res;
};

export const deleteGroupTEST = async () => {
  const res = await axios.delete(path + '/group',
      {
        params: paramsForDelete
      });
  return res;
};
