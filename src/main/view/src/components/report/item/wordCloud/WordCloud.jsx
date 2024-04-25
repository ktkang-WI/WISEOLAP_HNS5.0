import D3WordCloud from './D3WordCloud';

const WordCloud = ({
  setItemExports,
  id,
  item
}) => {
  const mart = item?.mart;
  if (!mart.init) {
    return <></>;
  }
  const seriesNames = mart.data.info.seriesMeasureNames;

  console.log(seriesNames);

  return (
    <D3WordCloud
      width={'100%'}
      height={'100%'}
      dataSource={mart.data.data}
      valueField={seriesNames[0].summaryName}
      labelField='arg'
    />
  );
};

export default WordCloud;
