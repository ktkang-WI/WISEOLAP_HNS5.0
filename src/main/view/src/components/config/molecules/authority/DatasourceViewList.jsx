import DataGrid, {Column, SearchPanel, Selection}
  from 'devextreme-react/data-grid';
import React, {useContext, useEffect, useState} from 'react';
import {
  AuthorityContext,
  getDataObjectOfUserOrGroup,
  getKeys,
  getUserOrGroup,
  getUserOrGroupOrigin,
  getUserOrGroupOriginNext,
  mode,
  path}
  from 'components/config/organisms/authority/Authority';
import passwordIcon from 'assets/image/icon/auth/ico_password.png';

import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/common/Title';
import localizedString from 'config/localization';
import icoEdit from 'assets/image/icon/auth/ico_edit.png';
import useModal from 'hooks/useModal';

const getDsViewKey = (dataSetMode, data, nextId) => {
  const prevKeys = getUserOrGroupOrigin(dataSetMode, data, nextId) || [];
  const nextKeys = getUserOrGroupOriginNext(dataSetMode, data, nextId) || [];
  const notNullPrevKey = prevKeys?.datas?.filter((cube) => {
    const cubeId = cube?.cubeId?.length ?? 0 != 0;
    const dsViewDim = cube?.dsViewDim?.length ?? 0 != 0;
    return cubeId || dsViewDim;
  });
  const notNullNextKey = nextKeys?.datas?.filter((cube) => {
    const cubeId = cube?.cubeId?.length ?? 0 != 0;
    const dsViewDim = cube?.dsViewDim?.length ?? 0 != 0;
    return cubeId || dsViewDim;
  });
  const prevKey = notNullPrevKey?.map((cube) => cube.dsViewId) ?? [];
  const nextKey = notNullNextKey?.map((cube) => cube.dsViewId) ?? [];
  const editKey = new Set();

  nextKey?.forEach((id) => {
    if (!prevKey.includes(id)) {
      editKey.add(id);
    }
  });

  notNullPrevKey?.forEach((prevItem) => {
    const nextItem = notNullNextKey.find((item) =>
      item.dsViewId === prevItem.dsViewId);
    const prevStringify =
    JSON.stringify(prevItem?.cubeId) +
    JSON.stringify(prevItem?.dsViewDim);
    const nextStringify =
    JSON.stringify(nextItem?.cubeId) +
    JSON.stringify(nextItem?.dsViewDim);
    if (prevStringify !== nextStringify) {
      editKey.add(prevItem.dsViewId);
    }
  });
  return {prevKey: prevKey, editKey: [...editKey]};
};

const setDsViewKey = (prevKey, editKey, dataSource, setDataSource) => {
  if (prevKey.length === 0 && editKey.length === 0) {
    setDataSource(dataSource.map((d) => {
      return {
        ...d,
        isAuth: 'none'
      };
    }));
  } else {
    setDataSource(dataSource.map((d) => {
      let isAuth = 'none';
      if (prevKey.includes(d.dsViewId)) {
        isAuth = 'visible';
      }
      if (editKey.includes(d.dsViewId)) {
        isAuth = 'edit';
      }
      return {
        ...d,
        isAuth: isAuth
      };
    }));
  }
};

const DatasourceViewList = ({mainKey, dependency, setDsViewId}) => {
  // context
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const [selectedKeys, setSelectedKeys] = useState();
  const [dataSource, setDataSource] = useState(getContext.state.dsView);
  const selected = getContext.state.selected;
  const data = getContext.state.data;
  const dataSetMode =
  currentTab === path.GROUP_DATA ? mode.GROUP : mode.USER;
  const {alert} = useModal();

  useEffect(() => {
    const updateData = () => {
      const {nextId} = getKeys(dataSetMode, selected);
      if (!nextId) return;
      const datas = getUserOrGroup(dataSetMode, data, nextId);
      if (!datas) {
        data.next.push({
          ...getDataObjectOfUserOrGroup(dataSetMode, nextId),
          datas: []
        });
      }
      const {prevKey, editKey} = getDsViewKey(dataSetMode, data, nextId);
      setDsViewKey(prevKey, editKey, dataSource, setDataSource);
    };
    setSelectedKeys([]);
    updateData();
  }, [dependency]);

  const handleSelectedKey = (selectedItems) => {
    if (!selected?.user?.next && !selected?.group?.next) {
      alert(localizedString.clickMe);
      setDsViewId(0);
      setSelectedKeys([]);
    } else {
      const dsViewId = selectedItems.selectedRowKeys[0];
      setDsViewId(dsViewId);
      setSelectedKeys([dsViewId]);

      const {nextId} = getKeys(dataSetMode, selected);
      if (!nextId) return;
      const {prevKey, editKey} = getDsViewKey(dataSetMode, data, nextId);
      setDsViewKey(prevKey, editKey, dataSource, setDataSource);
    }
  };

  return (
    <Wrapper>
      <Title title={localizedString.dsViewList}></Title>
      <DataGrid
        dataSource={dataSource}
        showBorders={true}
        height={'90%'}
        elementAttr={{
          class: 'datasource-view-list'
        }}
        keyExpr={'dsViewId'}
        selectedRowKeys={selectedKeys}
        onSelectionChanged={handleSelectedKey}
      >
        <Selection mode="single" />
        <SearchPanel visible={true} />
        <Column
          dataField="isAuth"
          caption=""
          dataType="varchar"
          format="currency"
          width="30px"
          cellRender={({value}) => {
            if (value === 'visible') {
              return <img height={'15px'} src={passwordIcon}/>;
            } else if (value === 'edit') {
              return <img height={'15px'} src={icoEdit}/>;
            }
          }}
        />
        <Column
          dataField="dsViewNm"
          caption={localizedString.dsViewName}
          dataType="varchar"
          format="currency"
        />
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

export default React.memo(DatasourceViewList);
