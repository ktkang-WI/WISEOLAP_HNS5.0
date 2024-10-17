import {getFullUrl} from 'components/common/atomic/Location/Location';

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

export const connectLinkedReport = (param, showReportList) => {
  if (param) {
    const {reportId, reportType, newWindowLinkParamInfo} = param;
    const params = new URLSearchParams(window.location.search);
    const fldFilter = params.get('fld') || false;
    const urlString =
        `${getFullUrl()}/linkviewer?reportId=${reportId}` +
        `&reportType=${reportType}` +
        (showReportList ? '&srl=true' : '') +
        (fldFilter ? '&fld=' + fldFilter : '');
    sessionStorage.setItem(
        'newWindowLinkParamInfo',
        JSON.stringify(newWindowLinkParamInfo)
    );
    const newWindow = window.open(urlString, '_blank');
    newWindow.focus();
  }
};
  // if (param) {
  //   // models.Report.generateLinkToken(param).then((res) => {
  //   models.Report.generateToken(param).then((res) => {
  //     if (res.status != 200) return;
  //     const token = res.data;
  //     const urlString =
  //       `${getFullUrl()}/linkviewer?token=${token}` +
  //       (showReportList ? '&srl=true' : '');
  //     const newWindow = window.open(urlString, '_blank');
  //     newWindow.focus();
  //   }).catch((error) => {
  //     console.error('Error sending link report:', error);
  //   });
  // }


export const openNewTab = (param, closeWindow, showReportList) => {
  if (param) {
    const {reportId, reportType} = param;
    const params = new URLSearchParams(window.location.search);
    const fldFilter = params.get('fld') || false;

    const urlString =
        `${getFullUrl()}/linkviewer?reportId=${reportId}` +
        `&reportType=${reportType}` +
        (showReportList ? '&srl=true' : '') +
        (fldFilter ? '&fld=' + fldFilter : '');

    const newWindow = window.open(urlString, '_blank');
    if (newWindow) {
      newWindow.focus();

      if (closeWindow) {
        window.close();
      }
    }
    // models.Report.generateToken(param).then((res) => {
    //   if (res.status != 200) return;
    //   const token = res.data;
    //   const urlString =
    //     `${getFullUrl()}/linkviewer?reportId=${token}` +
    //     (showReportList ? '&srl=true' : '');
    //   const newWindow = window.open(urlString, '_blank');
    //   if (newWindow) {
    //     newWindow.focus();

    //     if (closeWindow) {
    //       window.close();
    //     }
    //   }
    // }).catch((error) => {
    //   console.error('Error sending link report:', error);
    // });
  }
};
