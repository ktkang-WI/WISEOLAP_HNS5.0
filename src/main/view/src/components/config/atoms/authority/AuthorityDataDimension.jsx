import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import Title from 'components/config/atoms/common/Title';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
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

const AuthorityDataDimension = ({mainKey, dependency, dsViewId}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const selected = getContext.state.selected;
  const dsViewDim = getContext.state.dsViewDim;
  const [dataSource, setDataSource] = useState();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const data = getContext.state.data;
  const dataSetMode =
  currentTab === path.GROUP_DATA ? mode.GROUP : mode.USER;

  useEffect(() => {
    setDataSource(
        dsViewDim
            .filter((d) => d.dsViewId == dsViewId)
    );
  }, [dsViewId]);

  useEffect(() => {
    if (!dsViewId || !data?.next) return;
    const updateData = () => {
      const {nextId} = getKeys(dataSetMode, selected);
      if (!nextId) return;
      if (!getUserOrGroup(dataSetMode, data, nextId)) {
        const newItem = {
          ...getDataObjectOfUserOrGroup(dataSetMode, nextId),
          datas: []
        };
        data.next.push(newItem);
      }
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
    if (!userOrGroup) {
      const findedDsView =
        userOrGroup.datas.find((d) => d.dsViewId == dsViewId);
      if (!findedDsView) setSelectedKeys([]);
      else setSelectedKeys(findedDsView.dsViewDim);
    } else {
      const data = userOrGroup.datas.find((d) => d.dsViewId == dsViewId);
      if (!data) {
        // default create
        const temp = {
          dsViewId: dsViewId,
          cubeId: [],
          dsViewDim: []
        };
        userOrGroup.datas.push(temp);
        setSelectedKeys([]);
      } else {
        setSelectedKeys(data?.dsViewDim ?? []);
      }
    }
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
          {...cubeAuth, dsViewDim: selectedItems.selectedRowKeys} : cubeAuth
        )
      };
    });
    setSelectedKeys(selectedItems.selectedRowKeys);
  };

  return (
    <Wrapper>
      <Title title={localizedString.dimension}></Title>
      <DataGrid
        dataSource={dataSource}
        elementAttr={{
          class: 'authority-data-dimension'
        }}
        keyExpr={['dsViewId', 'dimDimUniNm']}
        showBorders={true}
        height="90%"
        selectedRowKeys={selectedKeys}
        onSelectionChanged={handleSelectedKey}
      >
        <Selection
          mode="multiple"
          showCheckBoxesMode={'always'}
        />
        <Column
          dataField="dimCaption"
          caption={localizedString.dimension}
          dataType="varchar"
        />
      </DataGrid>
    </Wrapper>
  );
};

export default React.memo(AuthorityDataDimension);
