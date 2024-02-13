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

const FolderList = ({setRow}) => {
  // context
  const reportFolderContext = useContext(ReportFolderContext);

  // state
  const [data, setData] = reportFolderContext.state.data;
  const folderListRef = reportFolderContext.ref.folderListRef;

  const initData = () => {
    const getParentFldNm = (fld) => data
        .find((d) => d.fldId === fld.fldParentId).fldNm;
    const newData = data.map((row) => {
      if (row.fldParentId === 0) {
        return {
          ...row,
          fldParentNm: ''
        };
      } else {
        return {
          ...row,
          fldParentNm: getParentFldNm(row)
        };
      }
    });
    setData(newData);
  };

  useEffect(() => {
    initData();
  }, []);

  const handleRowClick = useCallback(({data}) => {
    setRow(data);
  }, [data]);

  const handleSelectionChanged = useCallback(({selectedRowKeys}) => {
    if (selectedRowKeys.length === 0) {
      initData();
    }
  }, [data]);

  return (
    <Wrapper>
      <Title title={localizedString.folderList}></Title>
      <TreeList
        ref={folderListRef}
        dataSource={data}
        keyExpr="fldId"
        parentIdExpr="fldParentId"
        id="reportFolderManagementFolderList"
        height={'90%'}
        onRowClick={handleRowClick}
        onSelectionChanged={handleSelectionChanged}
      >
        <SearchPanel
          visible={true}
          width={250}
        />
        <Selection mode="single" />
        <Column
          dataField="fldNm"
          caption={localizedString.folderName}
          cellRender={({row}) => {
            return (
              <span>
                <img height={'17px'} src={folderImg}/>
                {row.data.fldNm}
              </span>
            );
          }}
        />
      </TreeList>
    </Wrapper>
  );
};

export default React.memo(FolderList);
