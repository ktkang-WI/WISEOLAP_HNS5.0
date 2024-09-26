import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const path = document.location.origin + contextRoot + '/report';

/**
 * 보고서 조회
 * @param {string} reportId
 */
export const getReportById = async (reportId) => {
  const res = await axios.post(path + '/report', {
    reportId: reportId
  });
  Object.keys(res.data).forEach((key) => {
    if (typeof res.data[key] === 'string') {
      res.data[key] = JSON.parse(res.data[key]);
    }
  });
  return res;
};

/**
 * 보고서 조회
 * @param {string} reportId
 * @param {string} reportSeq
 */
export const getReportHistory = async (reportId, reportSeq) => {
  const res = await axios.post(path + '/report', {
    reportId,
    reportSeq
  });
  Object.keys(res.data).forEach((key) => {
    if (typeof res.data[key] === 'string') {
      res.data[key] = JSON.parse(res.data[key]);
    }
  });
  return res;
};

/**
 * 보고서 이름만 조회
 * @param {string} reportId
 */
export const getOnlyReportName = async (reportId) => {
  const res = await axios.post(path + '/report-name', {
    reportId: reportId
  });

  return res;
};

/**
 * 보고서 쿼리 목록 조회
 */
export const getListIncludeQuery = async () => {
  const res = await axios.get(path + '/report-list/query');

  return res;
};

/**
 * 보고서 목록 조회
 *
 * @param {string} reportType
 * @param {string} editMode
 */
export const getList = async (reportType, editMode) => {
  const res = await axios.post(path + '/report-list', {
    editMode: editMode,
    reportType: reportType
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

export const insertLinkReport = async (param) => {
  return await axios.patch(path + '/report-link-save', param);
};

export const updateLinkReport = async (param) => {
  return await axios.patch(path + '/report-link-update', param);
};

/**
 * 연결 보고서 목록 가져오기
 * @param {JSON} reportId
 * @return {JSON}
 */
export const getLinkReportList = (reportId) => {
  const param = {
    reportId: reportId
  };
  return axios.post(path + '/report-link-list', param);
};

/**
 * 연결 보고서 필터정보 가져오기
 * @param {JSON} param
 * @return {JSON}
 */
export const getLinkReportParam = (param) => {
  return axios.post(path + '/report-link-param', param);
};

export const retrieveLinkReport = (token) => {
  // Ensure headers are set to indicate a JSON body
  return axios.post(
      `${path}/retrieve-link-report`,
      JSON.stringify({token: token}), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
};

export const generateToken = (param) => {
  return axios.post(path + '/generate-token', param);
};

export const generateLinkToken = (param) => {
  return axios.post(path + '/generate-link-token', param);
};

/**
 * 보고서 폴더 목록 가져오기
 * @param {JSON} param
 * @return {JSON}
 */
export const getFolderList = () => {
  return axios.post(path + '/report-folder-list');
};

/**
 * 보고서 삭제 / 보고서를 삭제 합니다. (delete)
 * @param {JSON} param
 */
export const deleteReport = async (param) => {
  return await axios.patch(path + '/report-delete', param);
};

/**
 * 즐겨찾기 보고서 추가 (
 * @param {JSON} param
 */
export const addFavoriteReport = async (param) => {
  return await axios.post(path + '/favorites-add', param);
};

/**
 * 즐겨찾기 보고서 삭제 (delete)
 * @param {JSON} param
 */
export const deleteFavoriteReport = async (param) => {
  return await axios.post(path + '/favorites-remove', param);
};
