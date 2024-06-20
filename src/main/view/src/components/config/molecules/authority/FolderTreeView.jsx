import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import TreeList, {
  Column,
  Editing,
  SearchPanel,
  Selection} from 'devextreme-react/tree-list';
import React, {useContext, useEffect, useState} from 'react';
import Title from 'components/config/atoms/common/Title';
import {AuthorityContext, getKeys, mode, path} from
  'components/config/organisms/authority/Authority';
import localizedString from 'config/localization';

const FolderTreeView = ({mainKey, dependency}) => {
  // context
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const [dataSource, setDataSource] = useState(getContext.state.folder);
  const selected = getContext.state.selected;
  const data = getContext.state.data;

  useEffect(() => {
    const dataSetMode =
      currentTab === path.GROUP_REPORT ? mode.GROUP : mode.USER;
    const updateData = () => {
      const {nextId} = getKeys(dataSetMode, selected);
      if (!nextId) return;
      const selectedTreeView = data.next.find((d) => d.grpId === nextId);
      if (!selectedTreeView) return;

      const selectedFlds = selectedTreeView.fldIds;
      const cleaningDataSource = dataSource.map((d) => {
        const isThereFld =
        selectedFlds.find((selectedData) => selectedData.fldId === d.fldId);
        if (!isThereFld) return d;
        return {
          ...d,
          ...isThereFld
        };
      });
      setDataSource(cleaningDataSource);
    };
    updateData();
  }, [dependency]);

  return (
    <Wrapper>
      <Title title={localizedString.publicReportFolderList}></Title>
      <TreeList
        elementAttr={{
          class: 'folder-tree-view'
        }}
        dataSource={dataSource}
        keyExpr="fldId"
        parentIdExpr="fldParentId"
        id="folderTreeView"
        editable={false}
        height={'90%'}
        // onItemSelectionChanged={handleTreeViewSelectionChanged}
      >
        <Editing
          mode="cell"
          allowUpdating={true}
        />
        <SearchPanel
          visible={true}
          width={250}
        />
        <Selection mode="none" />

        <Column
          dataField="fldNm"
          caption={localizedString.folderName}
        />
        <Column
          dataField="authView"
          dataType='boolean'
          caption={localizedString.querySearch}
        >
        </Column>
        <Column
          dataField="authPublish"
          dataType='boolean'
          caption={localizedString.reportView}
        >
        </Column>
        <Column
          dataField="authDataItem"
          dataType='boolean'
          caption={localizedString.useDataitem}
        >
        </Column>
        <Column
          dataField="authExport"
          dataType='boolean'
          caption={localizedString.reportDownload}
        >
        </Column>
        <Column
          dataField="fldParentId"
          visible={false}
        >
        </Column>
      </TreeList>
    </Wrapper>
  );
};

export default React.memo(FolderTreeView);
