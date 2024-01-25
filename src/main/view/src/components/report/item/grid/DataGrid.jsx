import DevDataGrid, {Column} from 'devextreme-react/data-grid';
import React from 'react';
import DataGridBullet from './DataGridBullet';

const DataGrid = ({id, item}) => {
  const mart = item ? item.mart : null;
  const maxValue = {};

  if (!mart.init) {
    return <></>;
  }

  const getMaxValue = (column) => {
    if (!maxValue[column.name]) {
      maxValue[column.name] =
      Math.max.apply(null, mart.data.data.map((row) => row[column.name]));
    }
    return maxValue[column.name];
  };

  const cellRender = (e, column) => {
    let endScaleValue = 0;
    if (column.detailSetting === 'bar') {
      endScaleValue = getMaxValue(column);

      return <DataGridBullet
        endScaleValue={endScaleValue}
        value={e.value}
        column={column}
      />;
    }
    return e.value;
  };

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
          cellRender={(e) => cellRender(e, column)}
        />
      )}
    </DevDataGrid>
  );
};

export default React.memo(DataGrid);
