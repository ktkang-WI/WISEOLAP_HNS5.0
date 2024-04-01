
const useLinkReportSave = () => {
  const omitProperties = (obj, ...props) => {
    const result = {...obj};
    props.forEach((prop) => {
      delete result[prop];
    });
    return result;
  };

  const omitPropertiesFromSubLinkReport = (subLinkReports) => {
    return subLinkReports.map((subLinkReport) => {
      const cleanedSubLinkReport =
        omitProperties(subLinkReport, 'subLinkParamInfo');
      if (cleanedSubLinkReport.subLinkReport &&
            Array.isArray(cleanedSubLinkReport.subLinkReport)) {
        cleanedSubLinkReport.subLinkReport =
            omitPropertiesFromSubLinkReport(cleanedSubLinkReport.subLinkReport);
      }
      return cleanedSubLinkReport;
    });
  };

  const genLinkParam = (dataSource) => {
    const dataArray = Object.keys(dataSource).map((key) => {
      const item = omitProperties(
          dataSource[key],
          'linkFkInfo',
          'linkParamInfo'
      );

      if (item.subLinkReport &&
          Array.isArray(item.subLinkReport)) {
        item.subLinkReport =
          omitPropertiesFromSubLinkReport(item.subLinkReport);
      }
      return item;
    });
    const param = {
      data: dataArray
    };
    return param;
  };
  return {
    genLinkParam
  };
};

export default useLinkReportSave;
