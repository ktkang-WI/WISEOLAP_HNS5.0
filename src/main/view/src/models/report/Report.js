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
 * @return {promise}
 */
export const addReport = async (param) => {
  return await axios.post(path + '/save-report', param);
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

/**
 * 보고서 전체 다운로드
 * @param {JSON} param
 */
export const downloadReportAll = (param) => {
  axios.post(path + '/download-report-all', param, {
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'blob'
  })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'new_Report.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Clean up
      })
      .catch((error) => console.error('Download error:', error));
};
