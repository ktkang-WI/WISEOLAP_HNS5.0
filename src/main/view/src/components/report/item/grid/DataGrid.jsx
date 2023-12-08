import DevDataGrid, {Column} from 'devextreme-react/data-grid';
import React from 'react';

const DataGrid = ({id, mart}) => {
  if (!mart.init) {
    return <></>;
  }

  return (
    <DevDataGrid
      width='100%'
      height='100%'
      id={id}
      dataSource={mart.data.data}
    >
      {mart.data.columns.map((column, index) =>
        <Column
          key={column.name}
          dataField={column.name}
          allowEditing={column.allowEditing}
        />
      )}
    </DevDataGrid>
  );
};

export default React.memo(DataGrid);
