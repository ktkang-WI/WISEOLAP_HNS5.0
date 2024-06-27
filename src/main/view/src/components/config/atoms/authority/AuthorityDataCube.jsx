import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import Title from 'components/config/atoms/common/Title';
import React, {useContext, useEffect, useState} from 'react';
import localizedString from 'config/localization';
import {
  AuthorityContext,
  getDataObjectOfUserOrGroup,
  getKeys,
  getUserOrGroup,
  mode,
  path}
  from 'components/config/organisms/authority/Authority';

const AuthorityDataCube = ({mainKey, dependency, dsViewId}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const selected = getContext.state.selected;
  const dsViewCube = getContext.state.dsViewCube;
  const data = getContext.state.data;
  const [dataSource, setDataSource] = useState();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [previousSelectedKeys, setPreviousSelectedKeys] = useState([]);
  const dataSetMode =
  currentTab === path.GROUP_DATA ? mode.GROUP : mode.USER;

  useEffect(() => {
    setPreviousSelectedKeys(selectedKeys);
  }, [selectedKeys]);

  useEffect(() => {
    setDataSource(
        dsViewCube
            .filter((d) => d.dsViewId == dsViewId)
    );
  }, [dsViewId]);

  useEffect(() => {
    if (!dsViewId || !data?.next) return;
    const updateData = () => {
      const {nextId} = getKeys(dataSetMode, selected);
      if (!nextId) return;
      if (getUserOrGroup(dataSetMode, data, nextId)) return;
      data.next.push({
        ...getDataObjectOfUserOrGroup(dataSetMode, nextId),
        datas: []
      });
    };
    setDataSource([]);
    setSelectedKeys([]);
    updateData();
  }, [dependency]);

  useEffect(() => {
    if (!dsViewId || !data?.next) return;
    const {nextId} = getKeys(dataSetMode, selected);
    if (!nextId) return;
    const userOrGroup = getUserOrGroup(dataSetMode, data, nextId);

    if (!userOrGroup) return;

    const findedDsView =
      userOrGroup.datas.find((d) => d.dsViewId == dsViewId);

    if (findedDsView) {
      setSelectedKeys(findedDsView.cubeId ?? []);
      return;
    }

    userOrGroup.datas.push({
      dsViewId: dsViewId,
      cubeId: [],
      dsViewDim: []
    });
    setSelectedKeys([]);
  }, [dsViewId]);

  const handleSelectedKey = (selectedItems) => {
    if (!dsViewId || !data?.next) return;
    const {nextId} = getKeys(dataSetMode, selected);
    if (!nextId) return;

    data.next = data.next.map((dataAuth) => {
      const idMatch = (dataAuth?.grpId || dataAuth?.userNo) == nextId;
      if (!idMatch) return dataAuth;

      return {
        ...dataAuth,
        datas: dataAuth.datas.map((cubeAuth) =>
          cubeAuth.dsViewId === dsViewId ?
          {...cubeAuth, cubeId: selectedItems.selectedRowKeys} : cubeAuth
        )
      };
    });

    if (
      JSON.stringify(selectedItems.selectedRowKeys) ===
      JSON.stringify(previousSelectedKeys)
    ) return;
    setSelectedKeys(selectedItems.selectedRowKeys);
  };

  return (
    <Wrapper>
      <Title title={localizedString.addCUBE}></Title>
      <DataGrid
        dataSource={dataSource}
        elementAttr={{
          class: 'authority-data-cube'
        }}
        showBorders={true}
        height="90%"
        keyExpr={['dsViewId', 'cubeId']}
        selectedRowKeys={selectedKeys}
        onSelectionChanged={handleSelectedKey}
      >
        <Selection
          mode="multiple"
          showCheckBoxesMode={'always'}
        />
        <Column
          dataField="cubeNm"
          caption={localizedString.addCUBE}
          dataType="varchar"
          format="currency"
        />
      </DataGrid>
    </Wrapper>
  );
};

export default React.memo(AuthorityDataCube);
