import axios from 'axios';

const path = '/report';

/**
 * 보고서 조회
 * @param {string} userId
 * @param {string} reportId
 * @return {axios}
 */
export const getReportById = (userId, reportId) => {
  return axios.post(path + '/report', {
    reportId: reportId,
    userId: userId
  });
};


/**
 * 보고서 목록 조회
 *
 * @param {string} userId
 * @param {string} reportType
 * @param {string} editMode
 * @return {axios}
 */
export const getList = (userId, reportType, editMode) => {
  return axios.post(path + '/report-list', {
    editMode: editMode,
    reportType: reportType,
    userId: userId
  });
};
/**
 * 보고서 저장
 * @param {JSON} param
 * @return {axios}
 */
export const addReport = (param) => {
  return axios.post(path + '/save-report', param);
};

/**
 * 보고서 폴더 목록 가져오기
 * @param {JSON} param
 * @return {axios}
 */
export const getFolderList = (param) => {
  return axios.post(path + '/report-folder-list', param);
};

/**
 * 보고서 삭제
 * @param {JSON} param
 * @return {axios}
 */
export const deleteReport = (param) => {
  return axios.post(path + '/delete-report', param);
};
