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

  const getTabContent = ({data}) => {
    return <ReportListTab items={reportList? reportList[data.id] : []}/>;
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
