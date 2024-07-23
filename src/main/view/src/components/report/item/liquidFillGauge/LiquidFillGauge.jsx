import React, {useMemo, useRef} from 'react';
import {getOptionValue}
  from '../util/modal/organism/notationFormat/NotationFormatModal';
import LiquidFillGaugeChart from './LiquidFillGaugeChart';
import {useInteractiveEffect} from '../util/useInteractiveEffect';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import {getBlendColor} from '../util/ColorManager';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';

const LiquidFillGauge = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart?.init) {
    return <></>;
  }
  const dataSource = mart.data.data;
  const seriesNames = mart.data.info.seriesMeasureNames;
  const ref = useRef();
  const {height, width} = useSizeObserver(ref);

  const {
    functions
  } = useInteractiveEffect({
    item: item,
    meta: meta,
    selectionFunc: (event) => {
      const refs = event.map((item) => item.ref);
      if (refs.length === 0) return;
      refs.forEach((ref) => {
        ref.current.classList.toggle('liquid-selected');
      });
    },
    removeSelectionFunc: (event) => {
      const refs = event.map((item) => item.ref);
      refs.forEach((ref) => {
        if (!ref?.current) return;
        ref.current.classList.toggle('liquid-selected');
      });
    }
  });
  useItemExport({
    id,
    ref,
    type: ItemType.LIQUID_FILL_GAUGE,
    data: mart?.data?.data,
    setItemExports});

  const handleClick = (e, data) => {
    e.data = data.dimension;
    functions.setDataMasterFilter(e.data);
    functions.masterFilterReload(e);
  };
  const palette = useMemo(() => getBlendColor({
    color: meta?.palette?.colors,
    item: item
  }), [meta?.palette?.colors]);
  return (
    <Wrapper
      ref={ref}
    >
      <LiquidFillGaugeChart
        id={id}
        width={width}
        height={height}
        dataSource={dataSource}
        argumentField='arg'
        autoCoulmn={meta?.liquidFillGaugeOption?.contentArray.autoNumberSet}
        valueField={seriesNames[0].summaryName}
        columnNumber={meta?.liquidFillGaugeOption?.contentArray.columnNumber}
        palette={palette}
        onClick={handleClick}
        notationFormat={
          getOptionValue(meta?.liquidFillGaugeOption?.notationFormat)
        }
      />
    </Wrapper>
  );
};
const propsComparator = (prev, next) => {
  let result = true;
  if (!_.isEqual(prev.item.mart, next.item.mart)) {
    result = false;
  }
  if (!_.isEqual(prev?.node?._rect?.width, next?.node?._rect?.width)) {
    result = false;
  }
  if (!_.isEqual(prev?.item?.meta, next?.item?.meta)) {
    result = false;
  }
  return result;
};

export default React.memo(LiquidFillGauge, propsComparator);
