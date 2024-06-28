import CommonTab from 'components/common/atomic/Common/Interactive/CommonTab';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
// eslint-disable-next-line max-len
import ReportListTab from 'components/common/atomic/ReportTab/organism/ReportListTab';
import ReportInfo from 'components/config/molecules/searchQuery/ReportInfo';
import {setIconReportList} from 'components/report/util/ReportUtility';
import localizedString from 'config/localization';

import models from 'models';
import {useEffect, useState} from 'react';

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


const searchQuery = () => {
  const [reportList, setReportList] = useState([]);
  const [itemData, setItemData] = useState({});

  useEffect(() => {
    models.Report.getList(null, 'viewer').then(({data}) => {
      setIconReportList(data.privateReport);
      setIconReportList(data.publicReport);
      setReportList(data);
    });
  }, []);

  const getTabContent = ({data}) => {
    return <ReportListTab
      items={reportList ? reportList[data.id] : []}
      width='100%'
      onItemClick={({itemData}) => {
        console.log('item Click');
        setItemData(itemData.type === 'FOLDER' ? {} : itemData);
      }}
    />;
  };

  return (
    <Wrapper display={'flex'}>
      <Wrapper width={'50%'}>
        <CommonTab
          dataSource={ReportTabSource}
          itemComponent={getTabContent}
          width='100%'
        />
      </Wrapper>
      <Wrapper width={'50%'}>
        <ReportInfo
          itemData={itemData}
        />
      </Wrapper>
    </Wrapper>
  );
};

export default searchQuery;
