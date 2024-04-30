import D3WordCloud from './D3WordCloud';

const WordCloud = ({
  setItemExports,
  id,
  item,
  node
}) => {
  const mart = item?.mart;
  if (!mart.init) {
    return <></>;
  }
  const seriesNames = mart.data.info.seriesMeasureNames;

  console.log(seriesNames);

  return (
    <D3WordCloud
      width={node?._rect?.width}
      height={node?._rect?.height}
      dataSource={mart.data.data}
      valueField={seriesNames[0].summaryName}
      labelField='arg'
    />
  );
};

export default WordCloud;
