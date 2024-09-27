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

export const connectLinkedReport = (param, closeWindow, showReportList) => {
  if (param) {
    models.Report.generateLinkToken(param).then((res) => {
      if (res.status != 200) return;
      const token = res.data;
      const urlString =
        `${getFullUrl()}/linkviewer?token=${token}` +
        (showReportList ? '&srl=true' : '');
      const newWindow = window.open(urlString, '_blank');
      newWindow.focus();
    }).catch((error) => {
      console.error('Error sending link report:', error);
    });
  }
};

export const openNewTab = (param, closeWindow, showReportList) => {
  if (param) {
    models.Report.generateToken(param).then((res) => {
      if (res.status != 200) return;
      const token = res.data;
      const urlString =
        `${getFullUrl()}/linkviewer?token=${token}` +
        (showReportList ? '&srl=true' : '');
      const newWindow = window.open(urlString, '_blank');
      if (newWindow) {
        newWindow.focus();

        if (closeWindow) {
          window.close();
        }
      }
    }).catch((error) => {
      console.error('Error sending link report:', error);
    });
  }
};
