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

const AuthorityDataMeasure = ({mainKey, dependency, cubeId, dsViewId}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const selected = getContext.state.selected;
  const [dataSource, setDataSource] = useState();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [previousSelectedKeys, setPreviousSelectedKeys] = useState([]);
  const initialized = useRef(false);
  const data = getContext.state.data;
  const dataSetMode =
  currentTab === path.GROUP_MEASURE ? mode.GROUP : mode.USER;

  useEffect(() => {
    setPreviousSelectedKeys(selectedKeys);
  }, [selectedKeys]);

  useEffect(() => {
    if (!cubeId) {
      if (dataSource?.length > 0) {
        setDataSource([]);
      }
      return;
    }
    models.Authority.getDsViewMea(cubeId).then((res) => {
      if (res.status == 200) {
        setSelectedKeys([]);
        setDataSource(res?.data?.data || []);
      }
    });
  }, [dsViewId, cubeId]);

  useEffect(() => {
    initialized.current = false;
    if (!cubeId || !data?.next) return;

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
    if (!cubeId || !data?.next) return;
    const {nextId} = getKeys(dataSetMode, selected);
    if (!nextId) return;

    const userOrGroup = getUserOrGroup(dataSetMode, data, nextId);

    if (!userOrGroup) return;


    const findCube =
        userOrGroup.datas.find((d) => d.cubeId == cubeId);

    if (findCube) {
      const newSelectedKeys = findCube.measures?.map(
          (id) => id) ?? [];

      if (JSON.stringify(selectedKeys) != JSON.stringify(newSelectedKeys)) {
        initialized.current = false;
      }

      setSelectedKeys(newSelectedKeys);
      return;
    }

    userOrGroup.datas.push({
      dsViewId: dsViewId,
      cubeId: cubeId,
      measures: []
    });
    setSelectedKeys([]);
  }, [dataSource]);

  const handleSelectedKey = (e) => {
    if (!cubeId || !data?.next) return;
    const {nextId} = getKeys(dataSetMode, selected);
    if (!nextId) return;

    const selectedItem = e.component.getSelectedRowsData('leavesOnly');

    const keys = selectedItem.map(({uniqueName}) => uniqueName);

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
          cubeAuth.cubeId === cubeId ?
          {...cubeAuth, measures: keys} : cubeAuth
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
      <Title title={localizedString.measure}></Title>
      <TreeList
        showRowLines={true}
        dataSource={dataSource}
        elementAttr={{
          class: 'authority-data-measure'
        }}
        keyExpr={'uniqueName'}
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
          dataField="caption"
          caption={localizedString.measure}
          dataType="string"
        />
      </TreeList>
    </Wrapper>
  );
};

export default React.memo(AuthorityDataMeasure);
