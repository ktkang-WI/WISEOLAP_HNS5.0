import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const accountPath = document.location.origin + contextRoot + '/account';

export const getGroups = async () => {
  const res = await axios.get(accountPath + '/group');
  return res;
};

export const getUserGroupManagement = () => {
  const res = axios.get(accountPath + '/user-group');
  return res;
};

export class User {
  userNo = 0;
  userId = '';
  userNm = '';
  email1 = '';
  email2 = '';
  telNo = '';
  grpId = '';
  userRunMode = '';
  userDesc = '';
  passwd = '';

  constructor({userNo = 0, userId = '', userNm = '', email1 = '', email2 = '',
    telNo = '', grpId = '', userRunMode = '', userDesc = '', passwd = ''}) {
    this.userNo = userNo;
    this.userId = userId;
    this.userNm = userNm;
    this.eamil1 = email1;
    this.email2 = email2;
    this.telNo = telNo;
    this.grpId = grpId;
    this.userRunMode = userRunMode;
    this.userDesc = userDesc;
    this.passwd = passwd;
  }

  getUser = async () => {
    const userGroupManageMent = await getUserGroupManagement()
        .then((res) => {
          return res.data.data;
        })
        .catch(() => {
          throw new Error('Failure Get User');
        });
    return userGroupManageMent.usersFormat;
  };

  createUser = () => {
    const user = {
      userId: this.userId,
      userNm: this.userNm,
      email1: this.email1,
      email2: this.email2,
      telNo: this.telNo,
      grpId: this.grpId,
      userRunMode: this.userRunMode,
      userDesc: this.userDesc,
      passwd: this.passwd
    };
    const res = axios.post(accountPath + '/user', null, {params: user});
    return res;
  };

  updateUser = () => {
    const user = {
      userId: this.userId,
      userNm: this.userNm,
      email1: this.email1,
      email2: this.email2,
      telNo: this.telNo,
      grpId: this.grpId,
      userRunMode: this.userRunMode,
      userDesc: this.userDesc,
      passwd: this.passwd,
      userNo: this.userNo
    };
    const res = axios.patch(accountPath + '/user', null, {params: user});
    return res;
  };

  /**
   * 사용자 관리 비밀번호 변경
   * @param {JSON} user 사용자 관리, 비밀번호에 필요한 정보 (현재 비밀번호, 새 비밀번호, 비밀번호 확인)
   * @return {response} response
  */
  updateUserPassword = () => {
    const user = {
      userNo: this.userNo,
      passwd: this.passwd
    };
    const res = axios.patch(accountPath + '/user/password', null,
        {params: user});
    return res;
  };

  deleteUser = () => {
    const user = {
      userNo: this.userNo
    };
    console.log(user);
    const res = axios.delete(accountPath + '/user', {
      params: user
    });
    return res;
  };
}

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
