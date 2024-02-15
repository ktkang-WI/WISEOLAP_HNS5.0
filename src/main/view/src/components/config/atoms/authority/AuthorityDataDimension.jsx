import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import Title from 'components/config/atoms/common/Title';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import localizedString from 'config/localization';
import {AuthorityContext} from
  'components/config/organisms/authority/Authority';
import {Mode} from 'components/config/organisms/authority/data/AuthorityData';

const AuthorityDataDimension = ({dsView, dsViewCube, row, auth}) => {
  // context
  const authorityContext = useContext(AuthorityContext);

  // state
  const [dimensionList, setDimensionList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data] = authorityContext.state.data;
  const authorityDataDimensionRef =
  authorityContext.ref.authorityDataDimensionRef;

  useEffect(() => {
    const dsViewId = dsView.dsViewId;
    let selectedDimensionList = [];

    if (auth.mode === Mode.GROUP_DATA ) {
      selectedDimensionList = data.find((d) => d.group?.grpId === row?.grpId)
          ?.dsViews?.cubeDimNm[dsViewId];
    }

    if (auth.mode === Mode.USER_DATA ) {
      selectedDimensionList = data.find((d) => d.user?.userNo === row?.userNo)
          ?.dsViews?.cubeDimNm[dsViewId];
    }

    const dsViewCubeRow = dsViewCube
        .find((row) => row.dsView.dsViewId === dsView.dsViewId);
    const newDimensionList = dsViewCubeRow ? dsViewCubeRow.cubeDim : [];

    setDimensionList(newDimensionList);
    setSelectedRowKeys(selectedDimensionList);
  }, [dsView, auth]);

  useEffect(() => {
    setDimensionList([]);
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
      <Title title={localizedString.dimension}></Title>
      <DataGrid
        ref={authorityDataDimensionRef}
        dataSource={dimensionList}
        showBorders={true}
        onRowClick={handleRowClick}
        selectedRowKeys={selectedRowKeys}
        onSelectionChanged={onSelectionChanged}
        height="90%"
        keyExpr="dimDimUniNm"
      >
        <Selection
          mode="multiple"
          showCheckBoxesMode={'always'}
        />
        <Column
          dataField="dimCaption"
          caption={localizedString.dimension}
          dataType="varchar"
          format="currency"
        />
      </DataGrid>
    </Wrapper>
  );
};

export default React.memo(AuthorityDataDimension);
