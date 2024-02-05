import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import Title from 'components/config/atoms/authority/Title';
import React, {useEffect, useState} from 'react';
import localizedString from 'config/localization';

const AuthorityDataCube = ({dsView, dsViewCube, row}) => {
  const [cubeList, setCubeList] = useState([]);

  useEffect(() => {
    const row = dsViewCube
        .find((row) => row.dsView.dsViewId === dsView.dsViewId);
    const newCubeList = row ? row.cube : [];

    setCubeList(newCubeList);
  }, [dsView]);

  useEffect(() => {
    setCubeList([]);
  }, [row]);

  const handleRowClick = () => {
    return;
  };

  return (
    <Wrapper>
      <Title title={localizedString.addCUBE}></Title>
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
          caption={localizedString.addCUBE}
          dataType="varchar"
          format="currency"
        />
      </DataGrid>
    </Wrapper>
  );
};

export default React.memo(AuthorityDataCube);
