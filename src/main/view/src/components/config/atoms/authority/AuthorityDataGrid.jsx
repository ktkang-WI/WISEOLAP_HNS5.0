import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import {useRef} from 'react';
const AuthorityDataGrid = () => {
  const ref = useRef();
  const groupsFormat = {};
  const handleRowClick = () => {
    return;
  };
  return (
    <DataGrid
      dataSource={groupsFormat}
      showBorders={true}
      onRowClick={handleRowClick}
      ref={ref}
      height="100%"
    >
      <Selection
        mode="multiple"
        showCheckBoxesMode={'onClick'}
      />
      <Column
        dataField="test"
        caption="주제 영역"
        dataType="varchar"
        format="currency"
      />
    </DataGrid>
  );
};

export default AuthorityDataGrid;
