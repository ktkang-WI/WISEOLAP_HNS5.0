import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const path = document.location.origin + contextRoot + '/dataset';


export const getAll = async (userId) => {
  const res = await axios.post(path + '/cubes', {
    userId: userId
  });

  return res.data;
};

export const getByCubeId = async (userId, cubeId) => {
  const res = await axios.post(path + '/cube', {
    cubeId: cubeId,
    userId: userId
  });

  return res.data;
};

export const getByDsViewId = async (userId, dsViewId) => {
  const res = await axios.post(path + '/cubes', {
    dsViewId: dsViewId,
    userId: userId
  });

  return res.data;
};
/**
 * @param {JSON} param
 * @param {function} callback
 */
export const getCubeInfo = (param, callback) => {
  axios.post(path + '/cube-column', param)
      .then(callback);
};
