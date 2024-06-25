import axios from 'axios';

const accountPath = '/account';

// 데이터셋
export const getDs = () => {
  const res = axios.get('/dataset/ds');
  return res;
};

export const getDsView = () => {
  const res = axios.get('/dataset/ds-dsview');
  return res;
};


export const getDsViewCube = () => {
  const res = axios.get('/dataset/ds/cube');
  return res;
};

export const getDsViewDim = () => {
  const res = axios.get('/dataset/ds/dim');
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

export class AuthorityReport {
  grpId = 0;
  userNo = 0;
  fldIds = [];

  constructor({grpId = 0, userNo = 0, fldIds = []}) {
    this.grpId = grpId;
    this.userNo = userNo;
    this.fldIds = fldIds;
  }

  createGroupAuthorityReport = () => {
    const authorityData = [];
    const data = {
      grpId: this.grpId,
      fldIds: this.fldIds.map((row) => ({
        fldId: row.fldId,
        authView: row.authView ? 'Y' : 'N',
        authPublish: row.authPublish ? 'Y' : 'N',
        authDataItem: row.authDataItem ? 'Y' : 'N',
        authExport: row.authExport ? 'Y' : 'N'
      }))
    };
    authorityData.push(data);
    const res = axios.put(accountPath + '/group/folder', {
      data: authorityData
    });
    return res;
  };

  createUserAuthorityReport = () => {
    const authorityData = [];
    const data = {
      userNo: this.userNo,
      fldIds: this.fldIds.map((row) => ({
        fldId: row.fldId,
        authView: row.authView ? 'Y' : 'N',
        authPublish: row.authPublish ? 'Y' : 'N',
        authDataItem: row.authDataItem ? 'Y' : 'N',
        authExport: row.authExport ? 'Y' : 'N'
      }))
    };
    authorityData.push(data);
    const res = axios.put(accountPath + '/user/folder', {
      data: authorityData
    });
    return res;
  };
}

export class AuthorityDataSet {
  grpId = 0;
  userNo = 0;
  fldId = [];

  constructor({grpId = 0, userNo = 0, fldId = []}) {
    this.grpId = grpId;
    this.userNo = userNo;
    this.fldId = fldId;
  }

  createGroupAuthorityDataSet = () => {
    const authorityData = [];
    const data = {
      grpId: this.grpId,
      fldId: this.fldId.filter((row) => row.isAuth).map((row) => row.fldId)
    };
    authorityData.push(data);
    const res = axios.put(accountPath + '/group/dataset', {
      data: authorityData
    });
    return res;
  };

  createUserAuthorityDataSet = () => {
    const authorityData = [];
    const data = {
      userNo: this.userNo,
      fldId: this.fldId.filter((row) => row.isAuth).map((row) => row.fldId)
    };
    authorityData.push(data);
    const res = axios.put(accountPath + '/user/dataset', {
      data: authorityData
    });
    return res;
  };
}

export class AuthorityDataSource {
  grpId = 0;
  userNo = 0;
  dsIds = [];

  constructor({grpId = 0, userNo = 0, dsIds = []}) {
    this.grpId = grpId;
    this.userNo = userNo;
    this.dsIds = dsIds;
  }

  createGroupAuthorityDataSource = () => {
    const authorityData = [];
    const data = {
      grpId: this.grpId,
      dsIds: this.dsIds
    };
    authorityData.push(data);
    const res = axios.put(accountPath + '/group/ds', {
      data: authorityData
    });
    return res;
  };

  createUserAuthorityDataSource = () => {
    const authorityData = [];
    const data = {
      userNo: this.userNo,
      dsIds: this.dsIds
    };
    authorityData.push(data);
    const res = axios.put(accountPath + '/user/ds', {
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

