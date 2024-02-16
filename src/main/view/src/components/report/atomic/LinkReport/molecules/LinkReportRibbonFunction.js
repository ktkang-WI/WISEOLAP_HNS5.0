import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {createLinkDataXML}
  from 'components/report/atomic/LinkReport/molecules/LinkReportFunction';
import LinkSlice from 'redux/modules/LinkSlice';
import store from 'redux/modules';

export const confirm = (
    linkParamData,
    linkReportInfo,
    checkLinkReportList,
    dispatch,
    onClose,
    paramInfo
) => {
  if (!linkParamData|| !linkParamData.reports ||
      linkParamData.reports.length === 0) {
    // console.error('Invalid linkParamData');
    return;
  }

  const {insertLink, updateLink} = LinkSlice.actions;
  const linkReportId = linkParamData.reports[0].reportId;
  const currentReportId = selectCurrentReportId(store.getState());
  const currentReportType = selectCurrentDesignerMode(store.getState());
  const dataPairs = paramInfo.map((info) => ({
    FK_COL_NM: info.fkParam,
    PK_COL_NM: info.pkParam
  }));
  const linkXml = createLinkDataXML(dataPairs);

  linkReportInfo.reportId = currentReportId;
  linkReportInfo.linkReportId = linkReportId;
  linkReportInfo.linkXml = linkXml;
  linkReportInfo.linkParamInfo = paramInfo;
  linkReportInfo.linkReportType = currentReportType;

  if (!checkLinkReportList.hasOwnProperty(linkReportId)) {
    dispatch(insertLink(linkReportInfo));
  } else {
    dispatch(updateLink(linkReportInfo));
  }
  onClose();
};
