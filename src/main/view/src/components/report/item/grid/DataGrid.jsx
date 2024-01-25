import DevDataGrid, {Column} from 'devextreme-react/data-grid';
import React from 'react';
import DataGridBullet from './DataGridBullet';

const DataGrid = ({id, item}) => {
  const mart = item ? item.mart : null;

  if (!mart.init) {
    return <></>;
  }

  return (
    <DevDataGrid
      width='100%'
      height='100%'
      id={id}
      dataSource={mart.data.data}
      sorting={false}
    >
      {mart.data.columns.map((column, i) =>
        <Column
          key={i}
          caption={column.caption}
          dataField={column.name}
          visible={column.visible}
          cellRender={column.detailSetting === 'bar' &&
          DataGridBullet}
        />
      )}
    </DevDataGrid>
  );
};

export default React.memo(DataGrid);
