import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import TreeList, {
  Column,
  Editing,
  SearchPanel,
  Selection} from 'devextreme-react/tree-list';

import React, {useContext, useEffect, useState} from 'react';
import Title from 'components/config/atoms/common/Title';
import {
  AuthorityContext,
  getDataObjectOfUserOrGroup,
  getKeys,
  getUserOrGroup,
  mode,
  path}
  from 'components/config/organisms/authority/Authority';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';

const DatasetTreeView = ({mainKey, dependency}) => {
  // context
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const dataSource = getContext.state.folderDataSets || [];
  const selected = getContext.state.selected;
  const data = getContext.state.data;
  const [selectedKeys, setSelectedKeys] = useState([]);
  const {alert} = useModal();
  const dataSetMode =
    currentTab === path.GROUP_DATASET ? mode.GROUP : mode.USER;

  useEffect(() => {
    const updateData = () => {
      const {nextId} = getKeys(dataSetMode, selected);
      if (!nextId) return;
      const fldId = getUserOrGroup(dataSetMode, data, nextId);
      if (!fldId) {
        data.next.push({
          ...getDataObjectOfUserOrGroup(dataSetMode, nextId),
          fldId: []
        });
      }
      setSelectedKeys(fldId?.fldId ?? []);
    };
    updateData();
  }, [dependency]);

  useEffect(() => {
    if (!data?.next) return;
    const dataSetMode =
      currentTab === path.GROUP_DATASET ? mode.GROUP : mode.USER;
    const {nextId} = getKeys(dataSetMode, selected);
    data.next = data.next.map((dataSetAuth) => {
      if (nextId === (dataSetAuth?.grpId || dataSetAuth?.userNo)) {
        dataSetAuth.fldId = [...new Set(selectedKeys)];
      }
      return dataSetAuth;
    });
  }, [selectedKeys]);

  const handleSelectedKey = (selectedItems) => {
    if (!selected?.user?.next && !selected?.group?.next) {
      alert(localizedString.clickMe);
      setSelectedKeys([]);
    } else {
      setSelectedKeys(selectedItems.selectedRowKeys);
    };
  };

  return (
    <Wrapper>
      <Title title={localizedString.datasetFolderList}></Title>
      <TreeList
        elementAttr={{
          class: 'dataset-tree-view'
        }}
        dataSource={dataSource}
        showBorders={true}
        keyExpr="fldId"
        parentIdExpr="parentFldId"
        selectedRowKeys={selectedKeys}
        onSelectionChanged={handleSelectedKey}
        height={'90%'}
      >
        <Editing
          mode="cell"
          allowUpdating={true}
        />
        <SearchPanel
          visible={true}
          width={250}
        />
        <Selection
          mode="multiple"
          showCheckBoxesMode={'always'}
        />
        <Column
          dataField="fldNm"
          caption={localizedString.folderName}
          allowEditing={false}
        />
      </TreeList>
    </Wrapper>
  );
};

export default React.memo(DatasetTreeView);
