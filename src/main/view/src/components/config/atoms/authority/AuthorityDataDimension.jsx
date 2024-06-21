import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import Title from 'components/config/atoms/common/Title';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import React, {useContext} from 'react';
import localizedString from 'config/localization';
import {AuthorityContext}
  from 'components/config/organisms/authority/Authority';

const AuthorityDataDimension = ({mainKey, dependency, dsViewId}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const dataSource = [];
  const dsViewCube = getContext.state.dsViewCube;
  dsViewCube.forEach((d) => d.cubeDim.forEach((c) => {
    dataSource.push(c);
  }));
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
