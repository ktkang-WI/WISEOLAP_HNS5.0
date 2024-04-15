import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import React, {useEffect, useRef} from 'react';
import D3Calendar from './D3Calendar';

const CalendarChart = ({setItemExports, id, item, node}) => {
  const mart = item ? item.mart : null;
  if (!mart.init) {
    return <></>;
  }
  const dataSource = mart.data.data;
  const dxRef = useRef();
  const itemExportObject =
    itemExportsObject(id, dxRef, 'CALENDAR', mart.data.data);

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

  const seriesNames = mart.data.info.seriesMeasureNames;

  return (
    <D3Calendar
      width={node?._rect?.width}
      dataSource={dataSource}
      argumentField='arg'
      valueFiled={seriesNames[0].summaryName}
    />
  );
};

const propsComparator = (prev, next) => {
  let result = true;
  if (!_.isEqual(prev.item.mart, next.item.mart)) {
    result = false;
  }
  if (!_.isEqual(prev?.item?.meta, next?.item?.meta)) {
    result = false;
  }
  return result;
};

export default React.memo(CalendarChart, propsComparator);
