import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import Title from 'components/config/atoms/common/Title';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import localizedString from 'config/localization';
import {AuthorityContext} from
  'components/config/organisms/authority/Authority';
import {Mode} from 'components/config/organisms/authority/data/AuthorityData';

const AuthorityDataCube = ({dsView, dsViewCube, row, auth}) => {
  // context
  const authoritycontext = useContext(AuthorityContext);

  // state
  const [cubeList, setCubeList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data] = authoritycontext.state.data;
  const authorityDataCubeRef = authoritycontext.ref.authorityDataCubeRef;

  useEffect(() => {
    const dsViewId = dsView.dsViewId;
    let selectedCubeList = [];

    if (auth.mode === Mode.GROUP_DATA ) {
      selectedCubeList = data.find((d) => d.group?.grpId === row?.grpId)
          ?.dsViews?.cubeId[dsViewId];
    }

    if (auth.mode === Mode.USER_DATA ) {
      selectedCubeList = data.find((d) => d.user?.userNo === row?.userNo)
          ?.dsViews?.cubeId[dsViewId];
    }

    const dsViewCubeRow = dsViewCube
        .find((row) => row.dsView.dsViewId === dsView.dsViewId);
    const newCubeList = dsViewCubeRow ? dsViewCubeRow.cube : [];

    setCubeList(newCubeList);
    setSelectedRowKeys(selectedCubeList);
  }, [dsView, auth]);

  useEffect(() => {
    setCubeList([]);
  }, [row, data]);

  const onSelectionChanged = useCallback(
      ({selectedRowKeys: changedRowKeys}) => {
        setSelectedRowKeys(changedRowKeys);
      },
      [],
  );

  const handleRowClick = () => {
    return;
  };

  return (
    <Wrapper>
      <Title title={localizedString.addCUBE}></Title>
      <DataGrid
        ref={authorityDataCubeRef}
        dataSource={cubeList}
        showBorders={true}
        onRowClick={handleRowClick}
        selectedRowKeys={selectedRowKeys}
        onSelectionChanged={onSelectionChanged}
        height="90%"
        keyExpr="cubeId"
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
