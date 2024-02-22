import DefaultCard from 'components/common/atomic/Common/Card/DefaultCard';


const Card = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  if (!mart.init) {
    return <></>;
  }

  console.log(mart.data.data);

  return (
    <DefaultCard
      dataSource={mart.data.data}
      column={2}
    />
  );
};

export default Card;
