import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const path = document.location.origin + contextRoot + '/report';

/**
 * 보고서 저장
 * @param {JSON} param
 * @param {function} callback
 */
export const addReport = (param, callback) => {
  axios.post(path + '/report-save', param)
      .then(callback);
};
