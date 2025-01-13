import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {
  Column,
  RowDragging,
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
import StyledTreeList from './StyledTreeList';
import {onDragChange, onReorder, onDragEnd}
  from 'components/config/utility/utility';
import reportFolderUtility from
  'components/useInfo/organism/myReportAndFolder/ReportFolderUtility';

const ReportList = ({setRow}) => {
  // context
  const reportFolderContext = useContext(ReportFolderContext);

  // state
  const [data, setData] = reportFolderContext.state.data[0].length > 0 &&
  reportFolderContext.state.data[0][0].key ?
  reportFolderContext.state.data : [];
  const reports = data;

  const {updatePublicReportOrderUtil} = reportFolderUtility();

  useEffect(() => {
    setRow(new Report({}));
  }, []);

  const handleRowClick = useCallback(({data}) => {
    const newReportParentNm = reports
        .find((report)=>report.key === data.parentId)?.fldNm;
    if (newReportParentNm) {
      data.fldParentNm = newReportParentNm;
    }
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

  const handleReorder = useCallback((e) => {
    const updatedEvent = {
      ...e,
      datasource: _.cloneDeep(data),
      key: 'key',
      parentKey: 'parentId',
      typeKey: 'type'
    };
    const {datasource, sourceData} = onReorder(updatedEvent);

    if (!datasource) {
      return;
    }

    // const newDatasource = datasource.filter((data) => data.type != 'FOLDER');
    updatePublicReportOrderUtil(datasource, sourceData, setData);
    e.component.clearSelection();
  }, [data]);

  return (
    <Wrapper>
      <Title title={localizedString.reportlist}></Title>
      <StyledTreeList
        showColumnHeaders={false}
        dataSource={data}
        keyExpr="key"
        parentIdExpr="parentId"
        elementAttr={{
          class: 'report-list'
        }}
        height={'calc(100% - 40px)'}
        onRowClick={handleRowClick}
        handleSelectionChanged={handleSelectionChanged}
      >
        <SearchPanel
          visible={true}
          width={'250'}
        />
        <Selection mode="single" />
        <RowDragging
          onDragChange={(e) => e.cancel = onDragChange({
            ...e,
            key: 'key',
            typeKey: 'type',
            isReport: true
          })}
          onReorder={handleReorder}
          onDragEnd={(e) => onDragEnd({
            component: e.component,
            datasource: data,
            key: 'key',
            parentKey: 'parentId'
          })}
          allowDropInsideItem={true}
          allowReordering={true}
          showDragIcons={false}
        />
        <Column
          dataField="name"
          caption={localizedString.reportName}
          cellRender={cellRender}
        />
      </StyledTreeList>
    </Wrapper>
  );
};

export default React.memo(ReportList);
