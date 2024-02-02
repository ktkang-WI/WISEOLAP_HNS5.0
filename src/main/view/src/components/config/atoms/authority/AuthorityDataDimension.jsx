import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import Title from 'components/config/atoms/authority/Title';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import React, {useEffect, useState} from 'react';
import localizedString from 'config/localization';

const AuthorityDataDimension = ({dsView, dsViewCube, row}) => {
  const [dimensionList, setDimensionList] = useState([]);
  useEffect(() => {
    const row = dsViewCube
        .find((row) => row.dsView.dsViewId === dsView.dsViewId);
    const newDimensionList = row ? row.cubeDim : [];

    setDimensionList(newDimensionList);
  }, [dsView]);

  useEffect(() => {
    setDimensionList([]);
  }, [row]);

  const handleRowClick = () => {
    return;
  };
  return (
    <Wrapper>
      <Title title={localizedString.dimension}></Title>
      <DataGrid
        dataSource={dimensionList}
        showBorders={true}
        onRowClick={handleRowClick}
        height="90%"
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
