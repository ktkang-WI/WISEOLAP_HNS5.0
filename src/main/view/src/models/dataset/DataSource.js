import axios from 'axios';

const path = '/dataset';

export const getByIdAndDsType = (userId, dsType) => {
  return axios.post(path + '/data-sources', {
    userId: userId,
    dsType: dsType
  });
};

export const getByDsId = (dsId) => {
  return axios.post(path + '/data-source', {
    dsId: dsId
  });
};
