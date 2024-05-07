import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import React, {useEffect, useRef} from 'react';
import D3Calendar from './D3Calendar';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import ItemManager from '../util/ItemManager';

const CalendarChart = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  if (!mart.init) {
    return <></>;
  }
  const dataSource = mart.data.data;
  const ref = useRef();
  const {width} = useSizeObserver(ref);
  const itemExportObject =
    itemExportsObject(id, ref, 'CALENDAR', mart.data.data);

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
    <Wrapper
      ref={ref}
    >
      <D3Calendar
        width={width}
        dataSource={dataSource}
        argumentField='arg'
        valueField={seriesNames[0].summaryName}
      />
    </Wrapper>
  );
};

export default React.memo(CalendarChart, ItemManager.commonPropsComparator);
