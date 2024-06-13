import axios from 'axios';

const path = '/upload';

export const uploadFile = (param) => {
  return axios.post(path + '/upload', param, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteFile = (param) => {
  return axios.post(path + '/delete', param);
};

export const importFile = (param) => {
  return axios.post(path + '/import', param, {
    responseType: 'arraybuffer'
  });
};

export const loadDecryptionFile = (param) => {
  return axios.post(path + '/loadDecryptionFile', param, {
    responseType: 'arraybuffer'
  });
};

export const uploadUserData = (dsId, dataNm, uploadData,
    appendTable, tableDeleteYN) => {
  return axios.post(path + '/upload-user-data', {
    dsId: parseInt(dsId),
    dataNm: dataNm,
    uploadData: JSON.stringify(uploadData),
    appendTable: appendTable,
    tableDeleteYN: tableDeleteYN
  });
};

export const hnsDrmUpload = (param) => {
  return axios.post(path + '/hnsDrmUpload', param, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
