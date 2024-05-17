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
import {DesignerMode, EditMode} from 'components/config/configType';
import useSpread from 'hooks/useSpread';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import LinkSlice from 'redux/modules/LinkSlice';
import {useSelector} from 'react-redux';
import {selectEditMode} from 'redux/selector/ConfigSelector';
import {selectReports} from 'redux/selector/ReportSelector';
import useModal from 'hooks/useModal';

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

const ReportTabs = () => {
  const [reportList, setReportList] = useState();
  const {loadReport, querySearch} = useReportSave();
  const {setExcelFile} = useSpread();
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
            const reportType = selectedReport.reportType;
            if (reportType === DesignerMode['EXCEL']) {
              await setExcelFile(selectedReport.id);
            }
            models.Report.getReportById('admin', selectedReport.id)
                .then(({data}) => {
                  try {
                    dispatch(setDesignerMode(selectedReport.reportType));
                    loadReport(data);
                    querySearch();
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

  useEffect(() => {
    models.Report.getList('admin', null, 'viewer').then(({data}) => {
      setIconReportList(data.privateReport);
      setIconReportList(data.publicReport);
      setReportList(data);
    });
  }, []);

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
