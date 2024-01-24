import DevDataGrid,
{Column, Paging, Scrolling} from 'devextreme-react/data-grid';
import React from 'react';
import DataGridBullet from './DataGridBullet';
import {useSelector} from 'react-redux';
import {selectCurrentDataField} from 'redux/selector/ItemSelector';
import {cellMerge, generateRowSpans} from './options/Merge';

const DataGrid = ({id, item}) => {
  const mart = item ? item.mart : null;
  const field = useSelector(selectCurrentDataField).field;
  let dataSource = null;
  let rowSpans = null;

  if (!mart.init) {
    return <></>;
  }

  const onCellPrepared = (e) => {
    if (e.rowType === 'data' && e.rowIndex === 0 && e.columnIndex === 0) {
      dataSource = _.cloneDeep(mart.data.data);
      rowSpans = generateRowSpans(dataSource, field);
    }
    cellMerge(e, rowSpans, field);
  };

  return (
    <DevDataGrid
      width='100%'
      height='100%'
      id={id}
      dataSource={mart.data.data}
      sorting={false}
      onCellPrepared={onCellPrepared}
    >
      <Paging enabled={false} />
      <Scrolling mode="standard" /> {/* or "virtual" | "infinite" */}
      {mart.data.columns.map((column, i) =>
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
