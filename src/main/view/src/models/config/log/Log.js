import axios from 'axios';

const logPath = '/log';

/**
 * @param {string} startDt 조회 구간 시작
 * @param {string} endDt 조회 구간 끝
 * @param {string} type 'USER'일 경우 현재 세션 접속된 유저의 기록만 반환
 * @return {Promise}
 */
export const getLoginLog = (startDt, endDt, type) => {
  const param = {
    startDt,
    endDt,
    type
  };

  const res = axios.get(logPath + '/login', {params: param});
  return res;
};

/**
 * @param {string} startDt 조회 구간 시작
 * @param {string} endDt 조회 구간 끝
 * @param {string} type 'USER'일 경우 현재 세션 접속된 유저의 기록만 반환
 * @return {Promise}
 */
export const getReportLog = (startDt, endDt, type) => {
  const param = {
    startDt,
    endDt,
    type
  };

  const res = axios.get(logPath + '/report', {params: param});
  return res;
};

/**
 * @param {string} startDt 조회 구간 시작
 * @param {string} endDt 조회 구간 끝
 * @param {string} type 'USER'일 경우 현재 세션 접속된 유저의 기록만 반환
 * @return {Promise}
 */
export const getDownloadLog = (startDt, endDt, type) => {
  const param = {
    startDt,
    endDt,
    type
  };

  const res = axios.get(logPath + '/export', {params: param});
  return res;
};


/**
 * @param {*} reportId 보고서 ID
 * @param {*} reportNm 보고서 명
 * @param {*} reportType 보고서 타입
 * @param {*} ctrlId 아이템 ID
 * @param {*} ctrlCaption 아이템 명
 * @return {Promise}
 */
export const insertDownloadLog = (
    reportId, reportNm, reportType, ctrlId, ctrlCaption) => {
  const param = {
    reportId,
    reportNm,
    reportType,
    ctrlId,
    ctrlCaption
  };

  const res = axios.post(logPath + '/export', param);
  return res;
};


/**
 * @param {string} startDt 조회 구간 시작
 * @param {string} endDt 조회 구간 끝
 * @param {string} type 'USER'일 경우 현재 세션 접속된 유저의 기록만 반환
 * @return {Promise}
 */
export const getQueryLog = (startDt, endDt, type) => {
  const param = {
    startDt,
    endDt,
    type
  };

  const res = axios.get(logPath + '/query', {params: param});
  return res;
};
