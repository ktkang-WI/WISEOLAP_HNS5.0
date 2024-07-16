import {getFullUrl} from 'components/common/atomic/Location/Location';
import models from 'models';

export const getSubLinkDim = (item) => {
  let newSubLinkDim = [];
  if (item && item.dimension) {
    newSubLinkDim = newSubLinkDim.concat(item.dimension);
  }
  if (item && (item.column || item.row)) {
    if (item.column) {
      newSubLinkDim = newSubLinkDim.concat(item.column);
    }
    if (item.row) {
      if (!item.column || item.column !== item.row) {
        newSubLinkDim = newSubLinkDim.concat(item.row);
      }
    }
  }
  if (item && item.field) {
    item.field.forEach((item) => {
      if (item.fieldType === 'DIM') {
        newSubLinkDim.push(item);
      }
    });
  }
  const subLinkDim = (newSubLinkDim);

  return subLinkDim;
};

export const connectLinkedReport = (info) => {
  const reportId = info.linkReportId;
  const reportType = info.subLinkReportType || info.linkReportType;

  if (info) {
    const tokenSource = {
      reportId: reportId,
      reportType: reportType
    };

    models.Report.generateToken(tokenSource).then((res) => {
      const token = res.data.token;
      const urlString =
        `${getFullUrl()}/linkViewer?token=${token}`;
      const newWindow = window.open(urlString, '_blank');
      if (newWindow) {
        newWindow.focus();
      }
    }).catch((error) => {
      console.error('Error sending link report:', error);
    });
  }
};
