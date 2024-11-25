// eslint-disable-next-line max-len
import Panel from 'components/config/organisms/userGroupManagement/common/Panel';
import CommonTab from 'components/common/atomic/Common/Interactive/CommonTab';
import localizedString from 'config/localization';
// eslint-disable-next-line max-len
import ReportListTab from 'components/common/atomic/ReportTab/organism/ReportListTab';
import React, {useState} from 'react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Toolbar, {Item} from 'devextreme-react/toolbar';

const ReportTabSource = [
  {
    id: 'publicReport',
    title: localizedString.publicReport
  }
];

const SearchQueryReportList = ({reportList, setItemData}) => {
  const [searchExpr, setSearchExpr] = useState('query');

  const searchTypes = [
    {
      id: 'query',
      text: '테이블 또는 컬럼 으로 검색'
    },
    {
      id: 'cubeNm',
      text: '주제영역 이름으로 검색'
    }
  ];

  const selectBoxOptions = {
    width: 250,
    items: searchTypes,
    valueExpr: 'id',
    displayExpr: 'text',
    value: searchExpr,
    onValueChanged: ({value}) => {
      setSearchExpr(value);
    }
  };

  const getTabContent = ({data}) => {
    return (
      <Wrapper>
        <Toolbar>
          <Item
            location="after"
            locateInMenu="auto"
            widget="dxSelectBox"
            options={selectBoxOptions}
          />
        </Toolbar>
        <ReportListTab
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
          searchExpr={[searchExpr]}
        />
      </Wrapper>
    );
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
