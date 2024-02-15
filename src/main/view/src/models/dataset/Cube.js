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

export class Cube {
  cubeId = 0;
  dsViewId = 0;
  cubeNm = '';
  cubeDesc = '';
  cubeOrdinal = 0;
  cubeDims = [];

  constructor({cubeId = 0, dsViewId = 0, cubeNm = 0, cubeDesc = '',
    cubeOrdinal = 0, cubeDims = []}) {
    this.cubeId = cubeId;
    this.dsViewId = dsViewId;
    this.cubeNm = cubeNm;
    this.cubeDesc = cubeDesc;
    this.cubeOrdinal = cubeOrdinal;
    this.cubeDims = cubeDims;
  }
}

export class CubeDim {
  cubeId = 0;
  dimUniNm = '';
  dimCaption = '';
  dimIsVisible = 0;
  dimDimUniNm = '';
  dimOrdinal = 0;

  constructor({cubeId = 0, dimUniNm = '', dimCaption = '',
    dimIsVisible = 0, dimDimUniNm = '', dimOrdinal = 0}) {
    this.cubeId = cubeId;
    this.dimUniNm = dimUniNm;
    this.dimCaption = dimCaption;
    this.dimIsVisible = dimIsVisible;
    this.dimDimUniNm = dimDimUniNm;
    this.dimOrdinal = dimOrdinal;
  }
}
