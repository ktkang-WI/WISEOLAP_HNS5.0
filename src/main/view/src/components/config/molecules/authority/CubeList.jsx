import DataGrid, {Column, Selection}
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
    const measures = cube?.measures?.length ?? 0 != 0;
    return measures;
  });
  const notNullNextKey = nextKeys?.datas?.filter((cube) => {
    const measures = cube?.measures?.length ?? 0 != 0;
    return measures;
  });
  const prevKey = notNullPrevKey?.map((cube) => cube.cubeId) ?? [];
  const nextKey = notNullNextKey?.map((cube) => cube.cubeId) ?? [];
  const editKey = new Set();

  nextKey?.forEach((id) => {
    if (!prevKey.includes(id)) {
      editKey.add(id);
    }
  });

  notNullPrevKey?.forEach((prevItem) => {
    const nextItem = notNullNextKey.find((item) =>
      item.cubeId === prevItem.cubeId);
    const prevStringify =
    JSON.stringify(prevItem?.cubeId) +
    JSON.stringify(prevItem?.measures);
    const nextStringify =
    JSON.stringify(nextItem?.cubeId) +
    JSON.stringify(nextItem?.measures);
    if (prevStringify !== nextStringify) {
      editKey.add(prevItem.cubeId);
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
      if (prevKey.includes(d.cubeId)) {
        isAuth = 'visible';
      }
      if (editKey.includes(d.cubeId)) {
        isAuth = 'edit';
      }
      return {
        ...d,
        isAuth: isAuth
      };
    }));
  }
};

const CubeList = ({mainKey, dependency, setCubeId, dsViewId}) => {
  // context
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const [selectedKeys, setSelectedKeys] = useState();
  const [dataSource, setDataSource] = useState([]);
  const dsViewCube = getContext.state.dsViewCube || [];
  const selected = getContext.state.selected;
  const pageReload = getContext.state.pageReload;
  const data = getContext.state.data;
  const dataSetMode =
  currentTab === path.GROUP_MEASURE ? mode.GROUP : mode.USER;
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
      const source = dsViewCube.filter((d) => d.dsViewId == dsViewId);
      setDsViewKey(prevKey, editKey, source, setDataSource);
    };
    setSelectedKeys([]);
    updateData();
  }, [pageReload, dependency, dsViewId]);

  const handleSelectedKey = (selectedItems) => {
    if (!selected?.user?.next && !selected?.group?.next) {
      alert(localizedString.clickMe);
      setCubeId(0);
      setSelectedKeys([]);
    } else {
      const cubeId = selectedItems.selectedRowKeys[0];
      setCubeId(cubeId);
      setSelectedKeys([cubeId]);

      const {nextId} = getKeys(dataSetMode, selected);
      if (!nextId) return;
      const {prevKey, editKey} = getDsViewKey(dataSetMode, data, nextId);
      setDsViewKey(prevKey, editKey, dataSource, setDataSource);
    }
  };

  return (
    <Wrapper>
      <Title title={localizedString.addCUBE}></Title>
      <DataGrid
        dataSource={dataSource}
        showBorders={true}
        height={'90%'}
        elementAttr={{
          class: 'cube-list'
        }}
        keyExpr={'cubeId'}
        selectedRowKeys={selectedKeys}
        onSelectionChanged={handleSelectedKey}
      >
        <Selection mode="single" />
        <Column
          dataField="isAuth"
          caption=""
          dataType="string"
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
          dataField="cubeNm"
          caption={localizedString.addCUBE}
          dataType="string"
          format="currency"
        />
      </DataGrid>
    </Wrapper>
  );
};

export default React.memo(CubeList);
