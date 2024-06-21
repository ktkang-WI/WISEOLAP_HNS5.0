import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import Title from 'components/config/atoms/common/Title';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import React, {useContext, useEffect, useState} from 'react';
import localizedString from 'config/localization';
import {AuthorityContext, getKeys, getUserOrGroup, mode, path}
  from 'components/config/organisms/authority/Authority';

const AuthorityDataDimension = ({mainKey, dependency, dsViewId}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const dataSource = [];
  const selected = getContext.state.selected;
  const dsViewCube = getContext.state.dsViewCube;
  dsViewCube.forEach((d) => d.cubeDim.forEach((c) => {
    dataSource.push(c);
  }));
  const [selectedKeys, setSelectedKeys] = useState([]);
  const data = getContext.state.data;
  const dataSetMode =
  currentTab === path.GROUP_DATA ? mode.GROUP : mode.USER;

  useEffect(() => {
    const updateData = () => {
      const {nextId} = getKeys(dataSetMode, selected);
      if (!nextId) return;
      const obj = getUserOrGroup(dataSetMode, data, nextId);
      if (!obj) {
        const newItem = {
          ...(dataSetMode === mode.GROUP ? {grpId: nextId} : {}),
          ...(dataSetMode === mode.USER ? {userNo: nextId} : {}),
          datas: []
        };
        data.next.push(newItem);
      }
      if (!dsViewId) setSelectedKeys([]);
      else {
        setSelectedKeys(obj?.datas.find((d) =>
          d.dsViewId == dsViewId)?.dimUniNm ?? []);
      }
    };
    updateData();
  }, [dependency]);

  useEffect(() => {
    if (!data?.next) return;
    const {nextId} = getKeys(dataSetMode, selected);
    if (!nextId) return;
    const object = getUserOrGroup(dataSetMode, data, nextId);
    if (!object) {
      const findedDsView = object.datas.find((d) => d.dsViewId == dsViewId);
      if (!findedDsView) setSelectedKeys([]);
      else setSelectedKeys(findedDsView.dimUniNm);
    } else {
      const data = object.datas.find((d) => d.dsViewId == dsViewId);
      if (!data) {
        // default create
        const temp = {
          dsViewId: dsViewId,
          cubeId: [],
          dimUniNm: []
        };
        object.datas.push(temp);
        setSelectedKeys([]);
      } else {
        setSelectedKeys(data?.dimUniNm ?? []);
      }
    }
  }, [dsViewId]);

  const handleSelectedKey = (selectedItems) => {
    const {nextId} = getKeys(dataSetMode, selected);
    if (!nextId) return;
    data.next = data.next.map((d) => {
      if ((d?.grpId || d?.userNo) == nextId) {
        d.datas = d.datas.map((d2) => {
          if (d2.dsViewId == dsViewId) {
            return {
              ...d2,
              dimUniNm: selectedItems.selectedRowKeys
            };
          }
          return d2;
        });
      }
      return d;
    });
    setSelectedKeys(selectedItems.selectedRowKeys);
  };

  return (
    <Wrapper>
      <Title title={localizedString.dimension}></Title>
      <DataGrid
        dataSource={dataSource.filter((d) => d.dsViewId == dsViewId)}
        elementAttr={{
          class: 'authority-data-dimension'
        }}
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
          width="150px"
          dataField="cubeNm"
          caption={localizedString.addCUBE}
          dataType="varchar"
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
