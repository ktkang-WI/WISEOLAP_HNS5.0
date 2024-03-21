import React, {useEffect, useRef} from 'react';
import {getOptionValue}
  from '../util/modal/organism/notationFormat/NotationFormatModal';
import LiquidFillGaugeChart from './LiquidFillGaugeChart';
import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';

const LiquidFillGauge = ({setItemExports, id, item, node}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart?.init) {
    return <></>;
  }
  const dataSource = mart.data.data;
  const seriesNames = mart.data.info.seriesMeasureNames;
  const dxRef = useRef();
  const itemExportObject =
    itemExportsObject(id, dxRef, 'LIQUIDFILLGAUGE', mart.data.data);

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

  return (
    <LiquidFillGaugeChart
      ref={dxRef}
      id={id}
      width={node?._rect?.width}
      height={node?._rect?.height}
      dataSource={dataSource}
      argumentField='arg'
      autoCoulmn={meta?.liquidFillGaugeOption?.contentArray.autoNumberSet}
      valueField={seriesNames[0].summaryName}
      columnNumber={meta?.liquidFillGaugeOption?.contentArray.columnNumber}
      palette={meta?.palette}
      notationFormat={
        getOptionValue(meta?.liquidFillGaugeOption?.notationFormat)
      }
    />
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
