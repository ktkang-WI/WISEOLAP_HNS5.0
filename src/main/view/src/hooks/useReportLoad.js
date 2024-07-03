import {useDispatch} from 'react-redux';
import ConfigSlice from 'redux/modules/ConfigSlice';
import useReportSave from './useReportSave';
import LinkSlice from 'redux/modules/LinkSlice';
import localizedString from 'config/localization';
import models from 'models';

export default function useReportLoad() {
  const dispatch = useDispatch();
  const {loadReport} = useReportSave();
  const {setDesignerMode} = ConfigSlice.actions;
  const {setLinkReport, setSubLinkReport} = LinkSlice.actions;

  const getReport = async (reportId, reportType) => {
    const res = await models.Report.getReportById(reportId).then(({data}) => {
      try {
        if (reportType) {
          dispatch(setDesignerMode(reportType));
        }
        loadReport(data);
        return true;
      } catch (e) {
        alert(localizedString.reportCorrupted);
        return false;
      }
    }).catch(() => {
      alert(localizedString.reportCorrupted);
      return false;
    });

    return res;
  };

  const getLinkedReport = async (reportId) => {
    const res = await models.Report.getLinkReportList(reportId)
        .then((res) => {
          try {
            const subLinkReports = res.data.subLinkReports;
            const linkReports = res.data.linkReports;
            console.log('subLinkReports', subLinkReports);
            console.log('linkReports', linkReports);
            if (subLinkReports.length > 0) {
              dispatch(setSubLinkReport(subLinkReports[0]));
            } else if (subLinkReports.length === 0) {
              dispatch(setLinkReport(linkReports[0]));
            }
            return true;
          } catch (e) {
            alert(localizedString.linkReportCorrupted);
            return false;
          };
        }).catch(() => {
          alert(localizedString.linkReportCorrupted);
          return false;
        });

    return res;
  };
  return {
    getReport,
    getLinkedReport
  };
};
