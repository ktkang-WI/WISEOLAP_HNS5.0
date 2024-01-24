import DevDataGrid,
{Column, Paging, Scrolling} from 'devextreme-react/data-grid';
import React from 'react';
import DataGridBullet from './DataGridBullet';
import {cellMerge, generateRowSpans} from './options/Merge';

const DataGrid = ({id, item}) => {
  const mart = item ? item.mart : null;
  let dataSource = _.cloneDeep(mart.data);
  let rowSpans = null;

  if (!mart.init) {
    return <></>;
  }

  const onCellPrepared = (e) => {
    if (false) {
      if (e.rowType === 'data' && e.rowIndex === 0 && e.columnIndex === 0) {
        dataSource = _.cloneDeep(mart.data);
        rowSpans =
          _.cloneDeep(generateRowSpans(dataSource.data, dataSource.columns));
      }
      cellMerge(e, rowSpans, mart.data.columns);
    }
  };

  const onContentReady = (e) => {
    console.log(e);
  };

  return (
    <DevDataGrid
      width='100%'
      height='100%'
      id={id}
      dataSource={dataSource.data}
      sorting={false}
      onCellPrepared={onCellPrepared}
      onContentReady={onContentReady}
      showColumnLines={true}
      showRowLines={true}
    >
      <Paging enabled={true} />
      <Scrolling mode="standard" /> {/* or "virtual" | "infinite" */}
      {dataSource.columns.map((column, i) =>
        <Column
          key={i}
          caption={column.caption}
          dataField={column.name}
          visible={column.visible}
          cellRender={
            column.detailSetting === 'bar' &&
            DataGridBullet
          }
        />
      )}
    </DevDataGrid>
  );
};

export default React.memo(DataGrid);
