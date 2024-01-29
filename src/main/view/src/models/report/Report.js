import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const path = document.location.origin + contextRoot + '/report';

/**
 * 보고서 조회
 * @param {string} userId
 * @param {string} reportId
 */
export const getReportById = async (userId, reportId) => {
  const res = await axios.post(path + '/report', {
    reportId: reportId,
    userId: userId
  });
  Object.keys(res.data).forEach((key) => {
    if (typeof res.data[key] === 'string') {
      res.data[key] = JSON.parse(res.data[key]);
    }
  });
  return res;
};


/**
 * 보고서 목록 조회
 *
 * @param {string} userId
 * @param {string} reportType
 * @param {string} editMode
 */
export const getList = async (userId, reportType, editMode) => {
  const res = await axios.post(path + '/report-list', {
    editMode: editMode,
    reportType: reportType,
    userId: userId
  });

  return res;
};
/**
 * 보고서 저장 / 새로운 보고서를 저장 합니다.(insert)
 * @param {JSON} param
 * @return {promise}
 */
export const insertReport = async (param) => {
  return await axios.post(path + '/report-save', param);
};

/**
 * 보고서 저장 / 기존 보고서를 업데이트 합니다.(update)
 * @param {JSON} param
 * @return {promise}
 */
export const updateReport = async (param) => {
  return await axios.patch(path + '/report-save', param);
};

/**
 * 보고서 폴더 목록 가져오기
 * @param {JSON} param
 * @return {JSON}
 */
export const getFolderList = (param) => {
  return axios.post(path + '/report-folder-list', param);
};

/**
 * 보고서 삭제 / 보고서를 삭제 합니다. (delete)
 * @param {JSON} param
 */
export const deleteReport = async (param) => {
  return await axios.patch(path + '/report-delete', param);
};
