import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import TreeList, {
  Column,
  SearchPanel,
  Selection} from 'devextreme-react/tree-list';

import React, {useCallback, useContext, useEffect} from 'react';
import Title from 'components/config/atoms/common/Title';
import localizedString from 'config/localization';
import {ReportFolderContext} from
  'components/config/organisms/reportFolderManagement/ReportFolderManagement';
import folderImg from 'assets/image/icon/report/folder_load.png';
import dash from 'assets/image/icon/report/dash.png';
import excel from 'assets/image/icon/report/excel_file.png';
import adhoc from 'assets/image/icon/report/adhoc.png';
import {Report} from
  'models/config/reportFolderManagement/ReportFolderManagement';

const ReportList = ({setRow}) => {
  // context
  const reportFolderContext = useContext(ReportFolderContext);

  // state
  const [data] = reportFolderContext.state.data;

  useEffect(() => {
    setRow(new Report({}));
  }, []);

  const handleRowClick = useCallback(({data}) => {
    setRow(new Report(data));
  }, [data]);

  const handleSelectionChanged = useCallback(({selectedRowKeys}) => {
    if (selectedRowKeys.length === 0) {
      setRow(new Report({}));
    }
  }, [data]);

  const cellRender = useCallback(({row}) => {
    let img = folderImg;
    if (row.data.reportType === 'DashAny') {
      img = dash;
    }
    if (row.data.reportType === 'AdHoc') {
      img = adhoc;
    }
    if (row.data.reportType === 'Spread' ||
    row.data.reportType == 'Excel') {
      img = excel;
    }
    return (
      <span>
        <img height={'17px'} src={img}/>
        {row.data.name}
      </span>
    );
  }, [data]);

  return (
    <Wrapper>
      <Title title={localizedString.reportlist}></Title>
      <TreeList
        dataSource={data}
        keyExpr="key"
        parentIdExpr="parentId"
        elementAttr={{
          class: 'report-list'
        }}
        height={'90%'}
        onRowClick={handleRowClick}
        handleSelectionChanged={handleSelectionChanged}
      >
        <SearchPanel
          visible={true}
          width={250}
        />
        <Selection mode="single" />
        <Column
          dataField="name"
          caption={localizedString.reportName}
          cellRender={cellRender}
        />
      </TreeList>
    </Wrapper>
  );
};

export default React.memo(ReportList);
