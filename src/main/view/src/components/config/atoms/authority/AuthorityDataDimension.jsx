import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import Title from 'components/config/atoms/common/Title';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import React from 'react';
import localizedString from 'config/localization';

const AuthorityDataDimension = () => {
  return (
    <Wrapper>
      <Title title={localizedString.dimension}></Title>
      <DataGrid
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
