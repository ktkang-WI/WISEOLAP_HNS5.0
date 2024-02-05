import axios from 'axios';

const path = '/upload';

export const uploadFile = (param) => {
  return axios.post(path + '/import', param, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteFile = (param) => {
  return axios.post(path + '/delete', param);
};
