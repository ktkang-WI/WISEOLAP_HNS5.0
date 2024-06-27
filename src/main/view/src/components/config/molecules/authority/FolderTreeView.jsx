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
  path} from
  'components/config/organisms/authority/Authority';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';

const FolderTreeView = ({mainKey, dependency}) => {
  // context
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const [dataSource, setDataSource] = useState(getContext.state.folder);
  const selected = getContext.state.selected;
  const {alert} = useModal();
  const data = getContext.state.data;
  const dataSetMode =
    currentTab === path.GROUP_REPORT ? mode.GROUP : mode.USER;
  const returnItem = (item, setFalse) => {
    return {
      fldId: item.fldId,
      authView: setFalse ? false : item.authView,
      authPublish: setFalse ? false : item.authPublish,
      authDataItem: setFalse ? false : item.authDataItem,
      authExport: setFalse ? false : item.authExport
    };
  };
  const initDataSource = () => {
    setDataSource(dataSource.map((d) => {
      return {
        ...d,
        ...returnItem(d, true)
      };
    }));
  };
  useEffect(() => {
    const updateData = () => {
      const {nextId} = getKeys(dataSetMode, selected);
      if (!nextId) return;
      const selectedTreeView = getUserOrGroup(dataSetMode, data, nextId);
      if (!selectedTreeView) {
        initDataSource();
        return;
      }

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

  const onRowUpdating = (e) => {
    if (!selected?.user?.next && !selected?.group?.next) {
      alert(localizedString.clickMe);
      initDataSource();
      return;
    }
    const newData = {...e.oldData, ...e.newData};
    const {nextId} = getKeys(dataSetMode, selected);
    const isUpdate = data.next.some((d) => (d?.grpId || d?.userNo) === nextId);

    if (!isUpdate) {
      data.next.push({
        ...getDataObjectOfUserOrGroup(dataSetMode, nextId),
        fldIds: dataSource.map((fld) =>
          returnItem((fld.fldId === e.key ? newData : fld)), false)
      });
      return;
    }

    data.next = data.next.map((d) => {
      if (nextId !== (d?.grpId || d?.userNo)) {
        return {
          ...getDataObjectOfUserOrGroup(dataSetMode, (d.grpId || d.userNo)),
          fldIds: d.fldIds
        };
      }
      return {
        ...getDataObjectOfUserOrGroup(dataSetMode, nextId),
        fldIds: d.fldIds.map((fld) =>
          returnItem((fld.fldId === e.key ? newData : fld)), false)
      };
    });
  };

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
        height={'100%'}
        onRowUpdating={onRowUpdating}
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
          allowEditing={false}
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
