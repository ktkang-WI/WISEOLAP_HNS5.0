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

  return res.data;
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

  return res.data;
};
/**
 * 보고서 저장
 * @param {JSON} param
 * @param {function} callback
 */
export const addReport = (param, callback) => {
  axios.post(path + '/save-report', param)
      .then(callback);
};

/**
 * 보고서 폴더 목록 가져오기
 * @param {JSON} param
 * @param {function} callback
 */
export const getFolderList = (param, callback) => {
  axios.post(path + '/report-folder-list', param)
      .then(callback);
};

/**
 * 보고서 삭제
 * @param {JSON} param
 * @param {function} callback
 */
export const deleteReport = (param, callback) => {
  axios.post(path + '/delete-report', param)
      .then(callback);
};
