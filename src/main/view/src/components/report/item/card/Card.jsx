import DefaultCard from 'components/common/atomic/Common/Card/DefaultCard';


const Card = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  if (!mart.init) {
    return <></>;
  }
  const seriesNames = mart.data.info.seriesMeasureNames;

  console.log(mart.data.data);
  console.log(seriesNames);

  return (
    <DefaultCard
      dataSource={mart.data.data}
      argumentField='arg'
      valueFiled={seriesNames[0].summaryName}
      column={2}
    />
  );
};

export default Card;
