import instance from 'models/instance';

const path = '/upload';

export const uploadFile = (param) => {
  return instance.post(path + '/import', param, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteFile = (param) => {
  return instance.post(path + '/delete', param);
};
