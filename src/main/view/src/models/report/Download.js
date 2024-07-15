import axios from 'axios';

const path = '/download';

/**
 * 보고서 전체 다운로드 exceljs 사용
 * @param {JSON} param
 * @return {Promise}
 */
export const getExcelBlob = (param) => {
  return axios.post(path + '/report-excel-all-exceljs', param, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
