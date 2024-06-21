import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import Title from 'components/config/atoms/common/Title';
import React, {useContext} from 'react';
import localizedString from 'config/localization';
import {AuthorityContext}
  from 'components/config/organisms/authority/Authority';

const AuthorityDataCube = ({mainKey, dependency, dsViewId}) => {
  // context
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const dataSource = [];
  const dsViewCube = getContext.state.dsViewCube;
  dsViewCube.forEach((d) => d.cube.forEach((c) => {
    dataSource.push(c);
  }));
  return (
    <Wrapper>
      <Title title={localizedString.addCUBE}></Title>
      <DataGrid
        dataSource={dataSource.filter((d) => d.dsViewId == dsViewId)}
        elementAttr={{
          class: 'authority-data-cube'
        }}
        showBorders={true}
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
