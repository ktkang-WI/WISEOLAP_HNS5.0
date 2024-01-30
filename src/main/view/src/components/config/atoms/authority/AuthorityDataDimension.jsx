import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import Title from 'components/config/atoms/authority/Title';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {useEffect, useState} from 'react';

const AuthorityDataDimension = ({dsView, dsViewCube}) => {
  const [dimensionList, setDimensionList] = useState([]);
  useEffect(() => {
    const row = dsViewCube
        .find((row) => row.dsView.dsViewId === dsView.dsViewId);
    const newDimensionList = row ? row.cubeDim : [];

    setDimensionList(newDimensionList);
  }, [dsView]);

  const handleRowClick = () => {
    return;
  };
  return (
    <Wrapper>
      <Title title={'차원'}></Title>
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
          caption="차원"
          dataType="varchar"
          format="currency"
        />
      </DataGrid>
    </Wrapper>
  );
};

export default AuthorityDataDimension;
