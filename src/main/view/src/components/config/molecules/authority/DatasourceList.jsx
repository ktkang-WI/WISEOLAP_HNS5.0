import DataGrid, {Column, HeaderFilter, SearchPanel, Selection}
  from 'devextreme-react/data-grid';
import React, {useRef, useContext, useState, useEffect} from 'react';

import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/common/Title';
import {AuthorityContext, getKeys, mode, path}
  from 'components/config/organisms/authority/Authority';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';

export const getDatasourceList = (data, keys) => {
  return data?.filter((d) => keys.includes(d.dsId));
};

const DatasourceList = ({mainKey, dependency}) => {
  // context
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const dataSource = getContext.state.dataSourceData;
  const selected = getContext.state.selected;
  const data = getContext.state.data;
  const [selectedKeys, setSelectedKeys] = useState([]);
  const {alert} = useModal();

  // useState
  const ref = useRef();
  useEffect(() => {
    const dataSetMode =
      currentTab === path.GROUP_DATASOURCE ? mode.GROUP : mode.USER;
    const updateData = () => {
      const {nextId} = getKeys(dataSetMode, selected);
      if (!nextId) return;
      const dsIds = data?.next?.find((d) => {
        if (dataSetMode === mode.GROUP) {
          return d?.grpId == nextId;
        } else if (dataSetMode === mode.USER) {
          return d?.userNo == nextId;
        }
      });
      if (!dsIds) {
        const newItem = {
          ...(dataSetMode === mode.GROUP ? {grpId: nextId} : {}),
          ...(dataSetMode === mode.USER ? {userNo: nextId} : {}),
          dsIds: []
        };
        data.next.push(newItem);
      }
      setSelectedKeys(dsIds?.dsIds ?? []);
    };
    updateData();
  }, [dependency]);

  useEffect(() => {
    if (!data?.next) return;
    const dataSetMode =
      currentTab === path.GROUP_DATASOURCE ? mode.GROUP : mode.USER;
    const {nextId} = getKeys(dataSetMode, selected);
    data.prev = data.next;
    data.next = data.next.map((d) => {
      if (dataSetMode === mode.GROUP) {
        if (d?.grpId == nextId) {
          d.dsIds = [...new Set(selectedKeys)];
        }
      } else if (dataSetMode === mode.USER) {
        if (d?.userNo == nextId) {
          d.dsIds = [...new Set(selectedKeys)];
        }
      }
      return d;
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
      <Title title={localizedString.dataSourceList}></Title>
      <DataGrid
        ref={ref}
        elementAttr={{
          class: 'datasource-list'
        }}
        dataSource={dataSource}
        showBorders={true}
        keyExpr="dsId"
        selectedRowKeys={selectedKeys}
        onSelectionChanged={handleSelectedKey}
      >
        <HeaderFilter visible={false} />
        <Selection
          mode="multiple"
          showCheckBoxesMode={'always'}
        />
        <SearchPanel visible={true} />
        <Column
          dataField="dsNm"
          caption={localizedString.dataSourceName}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="dbmsType"
          caption={localizedString.dbType}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="ownerNm"
          caption={localizedString.owner}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="ip"
          caption={localizedString.dbAddress}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="dbNm"
          caption={localizedString.dbName}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="dsViewId"
          caption={localizedString.dsViewId}
          dataType="varchar"
          format="currency"
          visible={false}
        />
      </DataGrid>
    </Wrapper>
  );
};

export default React.memo(DatasourceList);
