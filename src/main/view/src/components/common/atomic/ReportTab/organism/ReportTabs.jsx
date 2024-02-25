import localizedString from 'config/localization';
import CommonTab from '../../Common/Interactive/CommonTab';
import CommonToolbar from '../../Common/CommonToolbar';
import Wrapper from '../../Common/Wrap/Wrapper';
import refresh from '../../../../../assets/image/icon/button/refresh.png';
import ReportListTab from './ReportListTab';
import SmallImageButton from '../../Common/Button/SmallImageButton';
import {useEffect, useState} from 'react';
import {setIconReportList} from 'components/report/util/ReportUtility';
import models from 'models';
import useReportSave from 'hooks/useReportSave';
import ConfigSlice from 'redux/modules/ConfigSlice';
import {useDispatch} from 'react-redux';
import {DesignerMode} from 'components/config/configType';
import useSpread from 'hooks/useSpread';

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

const ToolbarItems = [
  {
    location: 'after',
    key: '2',
    render: () => {
      return <SmallImageButton src={refresh}/>;
    }
  }
];

const ReportTabs = () => {
  const [reportList, setReportList] = useState();
  const {loadReport, querySearch} = useReportSave();
  const {setExcelFile} = useSpread();
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
            const reportType = selectedReport.reportType;
            if (reportType === DesignerMode['EXCEL']) {
              setExcelFile(selectedReport.id);
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
      <CommonToolbar items={ToolbarItems}/>
      <CommonTab
        dataSource={ReportTabSource}
        itemComponent={getTabContent}
      />
    </Wrapper>
  );
};

export default ReportTabs;
