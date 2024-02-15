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
import {Folder} from
  'models/config/reportFolderManagement/ReportFolderManagement';

const FolderList = ({setRow}) => {
  // context
  const reportFolderContext = useContext(ReportFolderContext);

  // state
  const [data] = reportFolderContext.state.data;
  const folderListRef = reportFolderContext.ref.folderListRef;

  useEffect(() => {
    setRow(new Folder({}));
  }, []);

  const handleRowClick = useCallback(({data}) => {
    setRow(data);
  }, [data]);

  const handleSelectionChanged = useCallback(({selectedRowKeys}) => {
    if (selectedRowKeys.length === 0) {
      setRow(new Folder({}));
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
