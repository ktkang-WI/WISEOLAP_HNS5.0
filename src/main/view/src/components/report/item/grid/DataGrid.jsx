import DevDataGrid, {Column} from 'devextreme-react/data-grid';
import React, {useEffect, useRef} from 'react';
import DataGridBullet from './DataGridBullet';
import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import NumberFormatUtility from 'components/utils/NumberFormatUtility';

const DataGrid = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  const maxValue = {};

  if (!mart.init) {
    return <></>;
  }

  const dxRef = useRef();

  const itemExportObject =
   itemExportsObject(id, dxRef, 'GRID', mart.data.data);

  useEffect(() => {
    setItemExports((prev) => {
      const itemExports =
        prev.filter((item) => item.id !== itemExportObject.id);
      return [
        ...itemExports,
        itemExportObject
      ];
    });
  }, [mart.data.data]);

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
    } else if (column.fieldType === 'MEA') {
      const labelSuffix = {
        O: column.format.suffixO,
        K: column.format.suffixK,
        M: column.format.suffixM,
        B: column.format.suffixB
      };
      const formatNumber = (value) => {
        return NumberFormatUtility.formatNumber(
            value,
            column.format.formatType,
            column.format.unit,
            column.format.precision,
            column.format.useDigitSeparator,
            undefined,
            labelSuffix,
            column.format.suffixEnabled,
            column.format.precisionType
        );
      };
      return formatNumber(e.value);
    }
    return e.value;
  };

  return (
    <DevDataGrid
      ref={dxRef}
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
