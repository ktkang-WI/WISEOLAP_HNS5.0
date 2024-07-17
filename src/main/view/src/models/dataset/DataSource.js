import axios from 'axios';

const path = '/dataset';

export const getByIdAndDsType = (userId, dsType) => {
  return axios.post(path + '/data-sources', {
    dsType: dsType
  });
};

export const getByDsId = (dsId) => {
  return axios.post(path + '/data-source', {
    dsId: dsId
  });
};

export const getDs = () => {
  const res = axios.get(path + '/ds');
  return res;
};

export class DataSource {
  dsId = 0;
  dsNm = '';
  dsViewId = 0;
  dsViewNm = '';
  ip = '';
  ownerNm = '';
  dbmsType = '';
  connector = '';
  connectorType = '';
  dbNm = '';
  dsDesc = '';
  hashYn = '';
  password = '';
  port = '';
  userId = '';
  userAreaYn = '';

  constructor({dsId = 0, dsNm = '', dsViewId = 0,
    dsViewNm = '', ip = '', ownerNm = '', dbmsType = '',
    connector = '', connectorType = '', dbNm = '',
    dsDesc = '', hashYn = '', password = '', port = '', userId = '',
    userAreaYn = ''}) {
    this.dsId = dsId;
    this.dsNm = dsNm;
    this.dsViewId = dsViewId;
    this.dsViewNm = dsViewNm;
    this.ip = ip;
    this.ownerNm = ownerNm;
    this.dbmsType = dbmsType;
    this.connector = connector;
    this.connectorType = connectorType;
    this.dbNm = dbNm;
    this.dsDesc = dsDesc;
    this.hashYn = hashYn;
    this.password = password;
    this.port = port;
    this.userId = userId;
    this.userAreaYn = userAreaYn;
  };

  createDs = () => {
    const ds = {
      dsNm: this.dsNm,
      ip: this.ip,
      dbNm: this.dbNm,
      dbmsType: this.dbmsType,
      ownerNm: this.ownerNm,
      connectorType: this.connectorType,
      port: this.port,
      userId: this.userId,
      password: this.password
    };

    const res = axios.post(path + '/ds', null, {params: ds});
    return res;
  };

  updateDs = () => {
    const ds = {
      dsId: this.dsId,
      dsNm: this.dsNm,
      dbNm: this.dbNm,
      ip: this.ip,
      userId: this.userId,
      password: this.password,
      port: this.port,
      dbmsType: this.dbmsType,
      ownerNm: this.ownerNm,
      dsDesc: this.dsDesc,
      connector: this.connector,
      connectorType: this.connectorType,
      userAreaYn: 'Y',
      hashYn: this.hashYn,
      wfYn: 'N'
    };

    const res = axios.patch(path + '/ds', null, {params: ds});
    return res;
  };

  deleteDs = () => {
    const ds = {
      dsId: this.dsId
    };

    const res = axios.delete(path + '/ds', {params: ds});
    return res;
  };
}
