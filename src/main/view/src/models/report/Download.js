import axios from 'axios';
import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const path = document.location.origin + contextRoot + '/download';

/**
 * 보고서 전체 다운로드 exceljs 사용
 * @param {JSON} param
 */
export const downloadReportExcelAll = (param) => {
  axios.post(path + '/report-excel-all-exceljs', param, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
      .then((response) => {
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'download.xlsx'; // Default filename if not set
        if (contentDisposition) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
          }
        }
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        // Show download completed message
      })
      .catch((error) => {
        console.error('Download error:', error);
      });
};
