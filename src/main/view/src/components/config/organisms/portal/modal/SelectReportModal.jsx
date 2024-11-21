import CommonTab from 'components/common/atomic/Common/Interactive/CommonTab';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import ReportListTab
  from 'components/common/atomic/ReportTab/organism/ReportListTab';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from 'config/localization';
import {useCallback, useRef} from 'react';

import folderImg from 'assets/image/icon/report/folder_load.png';
import dash from 'assets/image/icon/report/dash.png';
import excel from 'assets/image/icon/report/excel_file.png';
import adhoc from 'assets/image/icon/report/adhoc.png';

const ReportTabSource = [
  {
    id: 'publicReport',
    title: localizedString.publicReport
  }
];

const SelectReportModal = ({reportList, onSubmit, ...props}) => {
  const itemData = useRef({});

  const cellRender = useCallback((row) => {
    let img = folderImg;
    if (row.reportType === 'DashAny') {
      img = dash;
    }
    if (row.reportType === 'AdHoc') {
      img = adhoc;
    }
    if (row.reportType === 'Spread' ||
    row.reportType == 'Excel') {
      img = excel;
    }
    return (
      <>
        <img
          style={{marginTop: '1.5px', float: 'left'}}
          height={'17px'} src={img}/>
        <span style={{lineHeight: '17px', marginLeft: '5px'}}>
          {row.name}
        </span>
      </>
    );
  }, [reportList]);

  const getTabContent = ({data}) => {
    return <ReportListTab
      items={_.cloneDeep(reportList)}
      width='100%'
      height='calc(100% - 10px)'
      selectByClick={true}
      selectionMode='single'
      onItemClick={() => {}}
      parentIdExpr="parentId"
      keyExpr="key"
      itemRender={cellRender}
      onSelectionChanged={({component}) => {
        const nodes = component.getSelectedNodes();

        if (nodes.length == 0) {
          itemData.current = {};
          return;
        }

        const data = nodes[0].itemData;

        itemData.current = itemData.type === 'FOLDER' ? {} : data;
      }}
    />;
  };

  return (
    <Modal
      modalTitle={'보고서 검색'}
      width='400px'
      height='70vh'
      onSubmit={() => {
        return onSubmit(itemData.current);
      }}
      {...props}
    >
      <Wrapper
        padding='10px'
      >
        <CommonTab
          dataSource={ReportTabSource}
          itemComponent={getTabContent}
          width='100%'
        />
      </Wrapper>
    </Modal>
  );
};

export default SelectReportModal;
