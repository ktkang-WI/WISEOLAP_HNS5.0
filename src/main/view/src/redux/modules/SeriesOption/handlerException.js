// inner Function
const reportIdNullCheck = (reportId) => {
  if (!(reportId == 0 || reportId)) {
    throw new Error('ReportId is null');
  }
};

const payloadNullCheck = (payload) => {
  if (!payload) {
    throw new Error('PayLoad is null');
  }
};

const seriesOptionsNullCheck = (dataField) => {
  if (!dataField.seriesOptions) {
    throw new Error('SeriesOption is null!! not defined yet');
  }
};

const fieldIdNullCheck = (payload) => {
  if (!payload.fieldId) {
    throw new Error('fieldId not undefined');
  }
};

// Item Exception handler
const ExceptionCheck = {
  SeriesOptionInitNullCheck: (payload) => {
    payloadNullCheck(payload);
    fieldIdNullCheck(payload);
    reportIdNullCheck(payload.reportId);
  },
  SeriesOptionFetchNullCheck: (payload) => {
    payloadNullCheck(payload);
    fieldIdNullCheck(payload);
    reportIdNullCheck(payload.reportId);
    seriesOptionsNullCheck(payload);
  },
  SeriesOptionUpdateNullCheck: (payload) => {
    payloadNullCheck(payload);
    fieldIdNullCheck(payload);
    reportIdNullCheck(payload.reportId);
    seriesOptionsNullCheck(payload);
  },
  ReportIdNullCheck: (reportId) => {
    reportIdNullCheck(reportId);
  },
  SeriesOptionNullCheck: (dataField) => {
    seriesOptionsNullCheck(dataField);
  }
};

const ReportIdNullCheck = 'ReportIdNullCheck';
const SeriesOptionNullCheck = 'SeriesOptionNullCheck';
const SeriesOptionInitNullCheck = 'SeriesOptionInitNullCheck';
const SeriesOptionFetchNullCheck = 'SeriesOptionFetchNullCheck';
const SeriesOptionUpdateNullCheck = 'SeriesOptionUpdateNullCheck';

// handler Export
export {
  ExceptionCheck
};

// handler Action Export
export {
  ReportIdNullCheck,
  SeriesOptionNullCheck,
  SeriesOptionInitNullCheck,
  SeriesOptionUpdateNullCheck,
  SeriesOptionFetchNullCheck
};

