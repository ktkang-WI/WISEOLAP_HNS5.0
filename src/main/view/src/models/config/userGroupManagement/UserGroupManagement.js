import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const accountPath = document.location.origin + contextRoot + '/account';

export const getGroups = async () => {
  const res = await axios.get(accountPath + '/group');
  return res;
};

export const getUserGroupManagement = async () => {
  const res = await axios.get(accountPath + '/user-group');
  return res;
};

/**
 * 사용자 관리 비밀번호 변경
 * @param {JSON} user 사용자 관리, 비밀번호에 필요한 정보 (현재 비밀번호, 새 비밀번호, 비밀번호 확인)
 */
export const updateUserPassword = async (user) => {
  // const res = await axios.get(accountPath + '/user/password', null, {
  //   params: user
  // });
  // return res;
  return;
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
