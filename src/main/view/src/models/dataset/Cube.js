import axios from 'axios';

const path = '/dataset';

export const getAll = (userId) => {
  return axios.post(path + '/cubes', {
    userId: userId
  });
};

export const getByCubeId = (userId, cubeId) => {
  return axios.post(path + '/cube', {
    cubeId: cubeId,
    userId: userId
  });
};

export const getByDsViewId = (userId, dsViewId) => {
  return axios.post(path + '/cubes', {
    dsViewId: dsViewId,
    userId: userId
  });
};

export const getCubeInfo = (param) => {
  return axios.post(path + '/cube-column', param);
};
