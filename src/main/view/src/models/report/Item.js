import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const path = document.location.origin + contextRoot + '/report';

/**
 * 아이템 조회
 * @param {JSON} param
 * @param {function} callback
 */
export const getItemData = (param, callback) => {
  axios.post(path + '/item-data', param)
      .then(callback);
};
