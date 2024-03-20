import {getOptionValue}
  from '../util/modal/organism/notationFormat/NotationFormatModal';
import LiquidFillGaugeChart from './LiquidFillGaugeChart';

const LiquidFillGauge = ({setItemExports, id, item, node}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart?.init) {
    return <></>;
  }
  const dataSource = mart.data.data;
  const seriesNames = mart.data.info.seriesMeasureNames;
  return (
    <LiquidFillGaugeChart
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

export default LiquidFillGauge;
