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
  excelResourceGrp='';

  constructor({userNo = 0, userId = '', userNm = '', email1 = '', email2 = '',
    telNo = '', grpId = '', userRunMode = '', userDesc = '', passwd = '',
    hpNo = '', accountCreateDt = '', compCode = '', excelResourceGrp=''}) {
    this.userNo = userNo;
    this.userId = userId;
    this.userNm = userNm;
    this.email1 = email1;
    this.email2 = email2;
    this.telNo = telNo;
    this.grpId = grpId;
    this.userRunMode = userRunMode;
    this.userDesc = userDesc;
    this.passwd = passwd;
    this.hpNo = hpNo;
    this.accountCreateDt = accountCreateDt;
    this.compCode = compCode;
    this.excelResourceGrp = excelResourceGrp;
  }

  getUserGroups = async () => {
    const userGroupManageMent = await getUserGroupManagement()
        .then((res) => {
          return res.data.data;
        })
        .catch(() => {
          throw new Error('Failed Get User Groups');
        });
    return userGroupManageMent;
  };

  getUsers = async () => {
    const userGroupManageMent = await getUserGroupManagement()
        .then((res) => {
          return res.data.data;
        })
        .catch(() => {
          throw new Error('Failed Get Users');
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
      passwd: this.passwd,
      compCode: this.compCode,
      excelResourceGrp: this.excelResourceGrp
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
      userNo: this.userNo,
      compCode: this.compCode,
      excelResourceGrp: this.excelResourceGrp
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
    const res = axios.delete(accountPath + '/user', {
      params: user
    });
    return res;
  };
}

export class Group {
  grpId = 0;
  grpNm = '';
  grpDesc = '';
  grpRunMode = '';
  grpMemberUsers = [];
  grpNotMemberUsers = [];

  constructor({grpId = 0, grpNm = '', grpDesc = '', grpRunMode = '',
    grpMemberUsers = [], grpNotMemberUsers = []}) {
    this.grpId = grpId;
    this.grpNm = grpNm;
    this.grpDesc = grpDesc;
    this.grpRunMode = grpRunMode;
    this.grpMemberUsers = grpMemberUsers;
    this.grpNotMemberUsers = grpNotMemberUsers;
  }

  setGrpMemberUsers(grpMemberUsers) {
    this.grpMemberUsers = grpMemberUsers?.map((row) => {
      return {
        userNo: row.userNo
      };
    });
  }

  getUserGroups = async () => {
    const userGroupManageMent = await getUserGroupManagement()
        .then((res) => {
          return res.data.data;
        })
        .catch(() => {
          throw new Error('Failed Get User Groups');
        });
    return userGroupManageMent;
  };

  getGroupNotMemberUsers = async () => {
    const userGroupManageMent = await getUserGroupManagement()
        .then((res) => {
          return res.data.data;
        })
        .catch(() => {
          throw new Error('Failed Get Users');
        });
    return userGroupManageMent.usersFormat;
  };

  createGroup = () => {
    const group = {
      grpNm: this.grpNm,
      grpDesc: this.grpDesc,
      grpRunMode: this.grpRunMode
    };
    const res = axios.post(accountPath + '/group', {
      data: this.grpMemberUsers
    },
    {params: group});
    return res;
  };

  updateGroup = () => {
    const group = {
      grpId: this.grpId,
      grpNm: this.grpNm,
      grpDesc: this.grpDesc,
      grpRunMode: this.grpRunMode
    };
    const res = axios.patch(accountPath + '/group', {
      data: this.grpMemberUsers
    }, {params: group});
    return res;
  };

  deleteGroup = () => {
    const group = {
      grpId: this.grpId
    };
    const res = axios.delete(accountPath + '/group', {
      params: group
    });
    return res;
  };
}
