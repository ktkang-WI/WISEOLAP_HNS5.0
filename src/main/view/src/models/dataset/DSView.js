import axios from 'axios';

const path = '/dataset';

export const getByUserId = () => {
  return axios.post(path + '/ds-views');
};

export class DsView {
  dsId = 0;
  dsViewId = 0;
  dsViewNm = '';
  dsViewDesc = '';
  cube = {};
  cubeDim = {};

  constructor({dsId = 0, dsViewId = 0, dsViewNm = '', dsViewDesc = '',
    cube = {}, cubeDim = {}}) {
    this.dsId = dsId;
    this.dsViewId = dsViewId;
    this.dsViewNm = dsViewNm;
    this.dsViewDesc = dsViewDesc;
    this.cube = cube;
    this.cubeDim = cubeDim;
  }
};
