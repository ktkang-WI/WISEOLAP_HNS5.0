import axios from 'axios';

const accountPath = '/account';

// 데이터셋
export const getDsView = () => {
  const res = axios.get('/dataset/ds-dsview');
  return res;
};

export const getDsViewCube = () => {
  const res = axios.get('/dataset/ds/dsview-cube');
  return res;
};

// 그룹
export const getGroupFolder = () => {
  const res = axios.get(accountPath + '/group/folder');
  return res;
};

export const getGroupDataset = () => {
  const res = axios.get(accountPath + '/group/dataset');
  return res;
};

export const getGroupDs = () => {
  const res = axios.get(accountPath + '/group/ds');
  return res;
};

// 사용자
export const getUsers = () => {
  const res = axios.get(accountPath + '/user');
  return res;
};

export const getUserFolder = () => {
  const res = axios.get(accountPath + '/user/folder');
  return res;
};

export const getUserDataset = () => {
  const res = axios.get(accountPath + '/user/dataset');
  return res;
};

export const getUserDs = () => {
  const res = axios.get(accountPath + '/user/ds');
  return res;
};

// 권한
// 그룹 데이터
export class AuthorityData {
  grpId = 0;
  userNo = 0;
  dsViewList = [];
  cubeList = [];
  cubeDimList = [];

  constructor({grpId = 0, userNo = 0, dsViewList = [], cubeList = [],
    cubeDimList = []}) {
    this.grpId = grpId;
    this.userNo = userNo;
    this.dsViewList = dsViewList;
    this.cubeList = cubeList;
    this.cubeDimList = cubeDimList;
  }

  createGroupAuthorityData = () => {
    const authorityData = [];
    const data = {
      grpId: this.grpId,
      dsView: this.dsViewList,
      cube: this.cubeList,
      cubeDim: this.cubeDimList
    };
    authorityData.push(data);
    const res = axios.put(accountPath + '/group/data', {
      data: authorityData
    });
    return res;
  };

  createUserAuthorityData = () => {
    const authorityData = [];
    const data = {
      userNo: this.userNo,
      dsView: this.dsViewList,
      cube: this.cubeList,
      cubeDim: this.cubeDimList
    };
    authorityData.push(data);
    const res = axios.put(accountPath + '/user/data', {
      data: authorityData
    });
    return res;
  };
}
export const getGroupData = () => {
  const res = axios.get(accountPath + '/group/data');
  return res;
};

// 사용자 데이터
export const getUserData = () => {
  const res = axios.get(accountPath + '/user/data');
  return res;
};

export const getFolders = () => {
  const res = axios.get('config/folder-group');
  return res;
};

export const getFolderDatasets = () => {
  const res = axios.get('config/folder-dataset');
  return res;
};

