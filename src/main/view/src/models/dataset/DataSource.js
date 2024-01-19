import instance from 'models/instance';

const path = '/dataset';

export const getByIdAndDsType = (userId, dsType) => {
  return instance.post(path + '/data-sources', {
    userId: userId,
    dsType: dsType
  });
};

export const getByDsId = (dsId) => {
  return instance.post(path + '/data-source', {
    dsId: dsId
  });
};
