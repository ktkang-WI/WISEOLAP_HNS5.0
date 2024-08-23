import TreeList, {Column} from 'devextreme-react/tree-list';
import Title from 'components/config/atoms/common/Title';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import React, {useContext, useEffect, useRef, useState} from 'react';
import localizedString from 'config/localization';
import {
  AuthorityContext,
  getDataObjectOfUserOrGroup,
  getKeys,
  getUserOrGroup,
  mode,
  path}
  from 'components/config/organisms/authority/Authority';
import models from 'models';

const AuthorityDataDimension = ({mainKey, dependency, dsViewId}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const selected = getContext.state.selected;
  const dsViewDim = getContext.state.dsViewDim;
  const [dataSource, setDataSource] = useState();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [previousSelectedKeys, setPreviousSelectedKeys] = useState([]);
  const initialized = useRef(false);
  const data = getContext.state.data;
  const dataSetMode =
  currentTab === path.GROUP_DATA ? mode.GROUP : mode.USER;

  useEffect(() => {
    setPreviousSelectedKeys(selectedKeys);
  }, [selectedKeys]);

  useEffect(() => {
    models.Authority.getDsViewCol(dsViewId).then((res) => {
      if (res.status == 200) {
        const dsViewCol = res.data.data.map((col) => {
          return {
            ...col,
            parentId: col.dimUniNm,
            id: col.hieUniNm,
            name: col.hieCaption
          };
        });

        const source = dsViewDim
            .reduce((acc, d) => {
              if (d.dsViewId == dsViewId) {
                acc.push({
                  id: d.dimDimUniNm,
                  name: d.dimCaption,
                  ...d
                });
              }
              return acc;
            }, []).concat(dsViewCol);

        setDataSource(source);
      }
    });
  }, [dsViewId]);

  useEffect(() => {
    initialized.current = false;
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
      const newSelectedKeys = findedDsView.dsViewDim?.map(
          (dim) => dim.id || dim.dimDimUniNm) ?? [];

      if (JSON.stringify(selectedKeys) != JSON.stringify(newSelectedKeys)) {
        initialized.current = false;
      }

      setSelectedKeys(newSelectedKeys);
      return;
    }

    userOrGroup.datas.push({
      dsViewId: dsViewId,
      cubeId: [],
      dsViewDim: []
    });
    setSelectedKeys([]);
  }, [dataSource]);

  const handleSelectedKey = (e) => {
    if (!dsViewId || !data?.next) return;
    const {nextId} = getKeys(dataSetMode, selected);
    if (!nextId) return;

    const selectedItem = e.component.getSelectedRowsData('leavesOnly');

    const keys = selectedItem.map(({id}) => id);

    if (!initialized.current) {
      initialized.current = true;

      if (JSON.stringify(keys) == JSON.stringify(selectedKeys) ||
          (selectedKeys.length > 0 && selectedItem.length == 0)) {
        return;
      }
    }

    data.next = data.next.map((dataAuth) => {
      const idMatch = (dataAuth?.grpId || dataAuth?.userNo) == nextId;
      if (!idMatch) return dataAuth;

      return {
        ...dataAuth,
        datas: dataAuth.datas.map((cubeAuth) =>
          cubeAuth.dsViewId === dsViewId ?
          {...cubeAuth, dsViewDim: selectedItem} : cubeAuth
        )
      };
    });

    if (
      JSON.stringify(keys) ===
      JSON.stringify(previousSelectedKeys)
    ) return;
    setSelectedKeys(keys);
  };

  return (
    <Wrapper>
      <Title title={localizedString.dimension}></Title>
      <TreeList
        showRowLines={true}
        dataSource={dataSource}
        elementAttr={{
          class: 'authority-data-dimension'
        }}
        keyExpr={'id'}
        parentIdExpr={'parentId'}
        showBorders={true}
        height="90%"
        selection={{
          mode: 'multiple',
          recursive: true
        }}
        selectedRowKeys={selectedKeys}
        onSelectionChanged={handleSelectedKey}
      >
        <Column
          dataField="name"
          caption={localizedString.dimension}
          dataType="string"
        />
      </TreeList>
    </Wrapper>
  );
};

export default React.memo(AuthorityDataDimension);
