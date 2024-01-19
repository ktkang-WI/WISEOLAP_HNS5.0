import instance from 'models/instance';

const path = '/dataset';

export const getAll = (userId) => {
  return instance.post(path + '/cubes', {
    userId: userId
  });
};

export const getByCubeId = (userId, cubeId) => {
  return instance.post(path + '/cube', {
    cubeId: cubeId,
    userId: userId
  });
};

export const getByDsViewId = (userId, dsViewId) => {
  return instance.post(path + '/cubes', {
    dsViewId: dsViewId,
    userId: userId
  });
};

export const getCubeInfo = (param) => {
  return instance.post(path + '/cube-column', param);
};
