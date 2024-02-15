import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import React, {useRef} from 'react';
import Title from 'components/config/atoms/common/Title';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from 'config/localization';

const AuthorityDataMember = () => {
  const ref = useRef();
  const groupsFormat = {};
  const handleRowClick = () => {
    return;
  };
  return (
    <Wrapper>
      <Title title={localizedString.member}></Title>
      <DataGrid
        dataSource={groupsFormat}
        showBorders={true}
        onRowClick={handleRowClick}
        ref={ref}
        height="90%"
      >
        <Selection
          mode="multiple"
          showCheckBoxesMode={'onClick'}
        />
        <Column
          dataField="test"
          caption={localizedString.member}
          dataType="varchar"
          format="currency"
        />
      </DataGrid>
    </Wrapper>
  );
};

export default React.memo(AuthorityDataMember);
