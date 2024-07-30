import React, {useMemo, useRef} from 'react';
import D3Calendar from './D3Calendar';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import ItemManager from '../util/ItemManager';
import {getBlendColor} from '../util/ColorManager';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';

const CalendarChart = ({setItemExports, id, item}) => {
  const mart = item?.mart;
  const meta = item?.meta;
  if (!mart.init) {
    return <></>;
  }
  const dataSource = mart.data.data;
  const ref = useRef();
  const {width} = useSizeObserver(ref);

  useItemExport({
    id,
    ref,
    type: ItemType.CALENDAR,
    data: mart?.data?.data,
    setItemExports});

  const seriesNames = mart.data.info.seriesMeasureNames;

  const palette = useMemo(() => getBlendColor({
    color: meta?.palette?.colors,
    item: item
  }), [meta?.palette?.colors]);

  return (
    <Wrapper
      ref={ref}
      id={id}
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
