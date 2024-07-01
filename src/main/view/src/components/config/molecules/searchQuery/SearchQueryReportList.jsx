import CommonTab from 'components/common/atomic/Common/Interactive/CommonTab';
import localizedString from 'config/localization';
// eslint-disable-next-line max-len
import ReportListTab from 'components/common/atomic/ReportTab/organism/ReportListTab';
import React from 'react';

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

const SearchQueryReportList = ({reportList, setItemData}) => {
  const getTabContent = ({data}) => {
    return <ReportListTab
      items={reportList ? reportList[data.id] : []}
      width='100%'
      onItemClick={({itemData}) => {
        setItemData(itemData.type === 'FOLDER' ? {} : itemData);
      }}
      searchExpr={['query']}
    />;
  };

  return (
    <CommonTab
      dataSource={ReportTabSource}
      itemComponent={getTabContent}
      width='100%'
    />
  );
};

export default React.memo(SearchQueryReportList);
