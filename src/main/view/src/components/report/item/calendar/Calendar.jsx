import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import React, {useEffect, useMemo, useRef} from 'react';
import D3Calendar from './D3Calendar';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import ItemManager from '../util/ItemManager';
import {getBlendColor} from '../util/ColorManager';

const CalendarChart = ({setItemExports, id, item}) => {
  const mart = item?.mart;
  const meta = item?.meta;
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

  const palette = useMemo(() => getBlendColor({
    color: meta?.palette?.colors,
    item: item
  }), [meta?.palette?.colors]);

  return (
    <Wrapper
      ref={ref}
    >
      <D3Calendar
        width={width}
        dataSource={dataSource}
        argumentField='arg'
        valueField={seriesNames[0].summaryName}
        palette={palette}
      />
    </Wrapper>
  );
};

export default React.memo(CalendarChart, ItemManager.commonPropsComparator);
