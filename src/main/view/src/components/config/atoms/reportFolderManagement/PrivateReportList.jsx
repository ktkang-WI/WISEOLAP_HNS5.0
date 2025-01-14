import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from '../common/Title';
import StyledTreeList from './StyledTreeList';
import localizedString from 'config/localization';
import React, {useCallback, useEffect, useState} from 'react';
import folderImg from 'assets/image/icon/report/folder_load.png';
import dash from 'assets/image/icon/report/dash.png';
import excel from 'assets/image/icon/report/excel_file.png';
import adhoc from 'assets/image/icon/report/adhoc.png';
import {Column, SearchPanel, Selection}
  from 'devextreme-react/tree-list';
import {Report}
  from 'models/config/reportFolderManagement/ReportFolderManagement';


const PrivateReportList = ({data, setRowData}) => {
  const [newRows, setNewRows] = useState();
  useEffect(() => {
    const sortingRows = data.sort((a, b) =>a.fldOrdinal - b.fldOrdinal ||
      (a.fldNm.toLowerCase() < b.fldNm.toLowerCase() ? -1 : 1));
    setNewRows(sortingRows);
  }, [data]);
  // state
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
      <>
        <img
          style={{marginTop: '1.5px', float: 'left'}}
          height={'17px'} src={img}/>
        <span style={{lineHeight: '17px', marginLeft: '5px'}}>
          {row.data.name}
        </span>
      </>
    );
  }, [data]);

  const handleRowClick = useCallback(({data}) => {
    setRowData(new Report(data));
  }, [data]);

  return (
    <Wrapper>
      <Title title={localizedString.privateReportList}></Title>
      <StyledTreeList
        showColumnHeaders={false}
        dataSource={newRows}
        keyExpr="key"
        noDataText={localizedString.privateReportListNoDataTxt}
        parentIdExpr="parentId"
        elementAttr={{
          class: 'report-list'
        }}
        height={'calc(100% - 40px)'}
        onRowClick={handleRowClick}
      >
        <SearchPanel
          visible={true}
          width={'250'}
        />
        <Selection mode="single" />
        <Column
          dataField="name"
          caption={localizedString.reportName}
          cellRender={cellRender}
        />
      </StyledTreeList>
    </Wrapper>
  );
};
export default React.memo(PrivateReportList);
