// eslint-disable-next-line max-len
import Panel from 'components/config/organisms/userGroupManagement/common/Panel';
import CommonTab from 'components/common/atomic/Common/Interactive/CommonTab';
import localizedString from 'config/localization';
// eslint-disable-next-line max-len
import ReportListTab from 'components/common/atomic/ReportTab/organism/ReportListTab';
import React from 'react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

const ReportTabSource = [
  {
    id: 'publicReport',
    title: localizedString.publicReport
  }
];

const SearchQueryReportList = ({reportList, setItemData}) => {
  const getTabContent = ({data}) => {
    return <ReportListTab
      items={reportList ? reportList[data.id] : []}
      width='100%'
      height='calc(100% - 10px)'
      selectByClick={true}
      selectionMode='single'
      onItemClick={() => {}}
      onSelectionChanged={({component}) => {
        const nodes = component.getSelectedNodes();

        if (nodes.length == 0) {
          setItemData({});
          return;
        }

        const itemData = nodes[0].itemData;

        setItemData(itemData.type === 'FOLDER' ? {} : itemData);
      }}
      searchExpr={['query']}
    />;
  };

  return (
    <Panel title={localizedString.reportList}>
      <Wrapper
        padding='10px'
      >
        <CommonTab
          dataSource={ReportTabSource}
          itemComponent={getTabContent}
          width='100%'
        />
      </Wrapper>
    </Panel>
  );
};

export default React.memo(SearchQueryReportList);
