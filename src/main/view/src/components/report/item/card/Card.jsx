import DefaultCard from 'components/common/atomic/Common/Card/DefaultCard';


const Card = ({setItemExports, id, item, node}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart.init) {
    return <></>;
  }
  const dataSource = mart.data.data;
  const seriesNames = mart.data.info.seriesMeasureNames;

  return (
    <DefaultCard
      width={node?._rect?.width}
      dataSource={dataSource}
      argumentField='arg'
      autoCoulmn={meta?.cardOption?.contentArray.autoNumberSet}
      columnNumber={meta?.cardOption?.contentArray.columnNumber}
      valueFiled={seriesNames[0].summaryName}
      column={2}
    />
  );
};

export default Card;
