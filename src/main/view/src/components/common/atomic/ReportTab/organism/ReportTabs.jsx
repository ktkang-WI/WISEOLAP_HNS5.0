import localizedString from 'config/localization';
import CommonTab from '../../Common/Interactive/CommonTab';
import Wrapper from '../../Common/Wrap/Wrapper';
import ReportListTab from './ReportListTab';
import {useEffect, useState} from 'react';
import {setIconReportList} from 'components/report/util/ReportUtility';
import models from 'models';
import useReportSave from 'hooks/useReportSave';
import ConfigSlice from 'redux/modules/ConfigSlice';
import {useDispatch} from 'react-redux';
import {EditMode} from 'components/config/configType';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import LinkSlice from 'redux/modules/LinkSlice';
import {useSelector} from 'react-redux';
import {selectEditMode} from 'redux/selector/ConfigSelector';
import {selectReports} from 'redux/selector/ReportSelector';
import useModal from 'hooks/useModal';
import {connectLinkedReport} from 'components/report/util/LinkedReportUtility';

const theme = getTheme();

const ReportTabSource = [
  {
    id: 'publicReport',
    title: localizedString.publicReport
  },
  {
    id: 'privateReport',
    title: localizedString.privateReport
  }
];

const StyledTab = styled(CommonTab)`
  background: ${theme.color.white};
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid ${theme.color.gray200};
  padding: 10px;
`;

const ReportTabs = ({reportData}) => {
  const [reportList, setReportList] = useState();
  const {loadReport, querySearch} = useReportSave();
  const dispatch = useDispatch();
  const {alert} = useModal();

  const editMode = useSelector(selectEditMode);
  const reports = useSelector(selectReports);

  const {setDesignerMode} = ConfigSlice.actions;
  let dblClick = 0;
  const {setLinkReport, setSubLinkReport} = LinkSlice.actions;
  const getTabContent = ({data}) => {
    return <ReportListTab
      items={reportList? reportList[data.id] : []}
      onItemClick={async (e) => {
        dblClick ++;
        setTimeout(() => {
          dblClick --;
        }, 300);

        if (dblClick > 1) {
          if (editMode === EditMode['VIEWER']) {
            // 뷰어 보고서 갯수 제한(5개 까지)
            if (reports.length >= 6) {
              alert(localizedString.viewerReportLimit);
              return;
            }
          }

          const selectedReport = e.itemData;
          if (selectedReport && selectedReport.type == 'REPORT') {
            if (editMode == EditMode.VIEWER) {
              const isExist = (reports || []).find(
                  (report) => report.reportId == selectedReport.id);

              if (isExist) {
                alert(localizedString.duplicatedReportMsg);
                return;
              }
            }

            if (editMode == EditMode.VIEWER &&
              selectedReport.reportType == 'Excel') {
              connectLinkedReport({
                reportId: selectedReport.id,
                reportType: selectedReport.reportType,
                promptYn: selectedReport.promptYn
              });

              return;
            }

            models.Report.getReportById(selectedReport.id)
                .then(async ({data}) => {
                  try {
                    dispatch(setDesignerMode(selectedReport.reportType));
                    await loadReport(data);
                    if (selectedReport.promptYn === 'Y') {
                      querySearch();
                    }
                  } catch (e) {
                    console.error(e);
                    alert(localizedString.reportCorrupted);
                  }
                }).catch(() => {
                  alert(localizedString.reportCorrupted);
                });
            models.Report.getLinkReportList(selectedReport.id)
                .then((res) => {
                  const subLinkReports = res.data.subLinkReports;
                  const linkReports = res.data.linkReports;
                  console.log('subLinkReports', subLinkReports);
                  console.log('linkReports', linkReports);
                  if (subLinkReports.length > 0) {
                    dispatch(setSubLinkReport(subLinkReports[0]));
                  } else if (subLinkReports.length === 0) {
                    dispatch(setLinkReport(linkReports[0]));
                  }
                });
          }
        }
      }}
    />;
  };

  const setDatas = (data) => {
    setIconReportList(data.privateReport);
    setIconReportList(data.publicReport);
    setReportList(data);
  };

  useEffect(() => {
    if (reportData) return;

    models.Report.getList(null, 'viewer').then(({data}) => {
      setDatas(data);
    });
  }, []);

  useEffect(() => {
    if (!reportData) return;

    setDatas(reportData);
  }, [reportData]);

  return (
    <Wrapper>
      <StyledTab
        height={'100%'}
        dataSource={ReportTabSource}
        itemComponent={getTabContent}
      />
    </Wrapper>
  );
};

export default ReportTabs;
