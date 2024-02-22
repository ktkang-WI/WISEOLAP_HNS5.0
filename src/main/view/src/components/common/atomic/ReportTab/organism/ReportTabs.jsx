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
import {DesignerMode} from 'components/config/configType';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

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
  const dispatch = useDispatch();
  const {setDesignerMode} = ConfigSlice.actions;
  let dblClick = 0;

  const getTabContent = ({data}) => {
    return <ReportListTab
      items={reportList? reportList[data.id] : []}
      onItemClick={(e) => {
        dblClick ++;
        setTimeout(() => {
          dblClick --;
        }, 300);

        if (dblClick > 1) {
          const selectedReport = e.itemData;
          if (selectedReport && selectedReport.type == 'REPORT') {
            models.Report.getReportById('admin', selectedReport.id)
                .then(({data}) => {
                  try {
                    dispatch(setDesignerMode(selectedReport.reportType));
                    loadReport(data);
                    if (selectedReport.reportType !== DesignerMode['EXCEL']) {
                      querySearch();
                    }
                  } catch (e) {
                    console.error(e);
                    alert(localizedString.reportCorrupted);
                  }
                }).catch(() => {
                  alert(localizedString.reportCorrupted);
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
