import axios from 'axios';

const path = document.location.origin + '/dataset';


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
