import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import Title from 'components/config/atoms/authority/Title';
import {useEffect, useState} from 'react';

const AuthorityDataCube = ({dsView, dsViewCube}) => {
  const [cubeList, setCubeList] = useState([]);

  useEffect(() => {
    const row = dsViewCube
        .find((row) => row.dsView.dsViewId === dsView.dsViewId);
    const newCubeList = row ? row.cube : [];

    setCubeList(newCubeList);
  }, [dsView]);

  const handleRowClick = () => {
    return;
  };

  return (
    <Wrapper>
      <Title title={'주제영역'}></Title>
      <DataGrid
        dataSource={cubeList}
        showBorders={true}
        onRowClick={handleRowClick}
        height="90%"
      >
        <Selection
          mode="multiple"
          showCheckBoxesMode={'always'}
        />
        <Column
          dataField="cubeNm"
          caption="주제 영역"
          dataType="varchar"
          format="currency"
        />
      </DataGrid>
    </Wrapper>
  );
};

export default AuthorityDataCube;
