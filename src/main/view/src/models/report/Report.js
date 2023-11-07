import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const path = document.location.origin + contextRoot + '/report';

/**
 * 보고서 목록 조회
 * @param {string} userId
 * @param {string} reportId
 */
export const getById = async (userId, reportId) => {
  const res = await axios.post(path + '/report', {
    reportId: reportId,
    userId: userId
  });

  return res.data;
};
