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
import {Folder} from
  'models/config/reportFolderManagement/ReportFolderManagement';
import StyledTreeList from './StyledTreeList';
import {onDragChange, onReorder, onDragEnd}
  from 'components/config/utility/utility';
import reportFolderUtility from
  'components/useInfo/organism/myReportAndFolder/ReportFolderUtility';

const FolderList = ({setRow}) => {
  // context
  const reportFolderContext = useContext(ReportFolderContext);

  // state
  const [data, setData] = reportFolderContext.state.data;
  const {updatePublicFolderOrderUtil} = reportFolderUtility();
  const folders = data;

  useEffect(() => {
    setRow(new Folder({}));
  }, []);

  const handleRowClick = useCallback(({data}) => {
    const newFldParentNm = folders
        .find((folder)=>folder.fldId === data.fldParentId)?.fldNm;
    if (newFldParentNm) {
      data.fldParentNm = newFldParentNm;
    }
    setRow(new Folder(data));
  }, [data]);

  const handleSelectionChanged = useCallback(({selectedRowKeys}) => {
    if (selectedRowKeys.length === 0) {
      setRow(new Folder({}));
    }
  }, [data]);

  const handleReorder = useCallback((e) => {
    const updatedEvent = {
      ...e,
      datasource: _.cloneDeep(data),
      key: 'fldId',
      parentKey: 'fldParentId',
      typeKey: 'type'
    };
    const {datasource, sourceData} = onReorder(updatedEvent);

    if (!datasource) {
      return;
    }

    updatePublicFolderOrderUtil(datasource, sourceData, setData);
    e.component.clearSelection();
  }, [data]);

  return (
    <Wrapper>
      <Title title={localizedString.folderList}></Title>
      <StyledTreeList
        dataSource={data}
        keyExpr="fldId"
        parentIdExpr="fldParentId"
        elementAttr={{
          class: 'folder-list'
        }}
        height={'calc(100% - 40px)'}
        showColumnHeaders={false}
        onRowClick={handleRowClick}
        onSelectionChanged={handleSelectionChanged}
      >
        <SearchPanel
          visible={true}
          width={250}
        />
        <Selection mode="single" />
        <RowDragging
          onDragChange={(e) => e.cancel = onDragChange({...e, key: 'fldId'})}
          onReorder={handleReorder}
          onDragEnd={(e) => onDragEnd({
            component: e.component,
            datasource: data,
            key: 'fldId',
            parentKey: 'fldParentId'
          })}
          allowDropInsideItem={true}
          allowReordering={true}
          showDragIcons={false}
        />
        <Column
          dataField="fldNm"
          caption={localizedString.folderName}
          cellRender={({row}) => {
            return (
              <>
                <img
                  style={{marginTop: '1.5px', float: 'left'}}
                  height={'17px'} src={folderImg}/>
                <span style={{lineHeight: '17px', marginLeft: '5px'}}>
                  {row.data.fldNm}
                </span>
              </>
            );
          }}
        />
      </StyledTreeList>
    </Wrapper>
  );
};

export default React.memo(FolderList);
