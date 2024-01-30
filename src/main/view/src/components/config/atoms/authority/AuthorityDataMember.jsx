import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import {useRef} from 'react';
import Title from 'components/config/atoms/authority/Title';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

const AuthorityDataMember = () => {
  const ref = useRef();
  const groupsFormat = {};
  const handleRowClick = () => {
    return;
  };
  return (
    <Wrapper>
      <Title title={'멤버'}></Title>
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
          caption="멤버"
          dataType="varchar"
          format="currency"
        />
      </DataGrid>
    </Wrapper>
  );
};

export default AuthorityDataMember;
