import Card from './Card';

const Cards = ({cardData}) => {
  if (cardData.length == 0) {
    return <div className='no-card'> 조회된 데이터가 없습니다. </div>;
  }

  return <>{
    cardData?.map((d, i) => {
      return (
        <Card
          title={d['구분']}
          key={'card' + i}
          amount={d['금액']}
          percentData={{
            previous: d['전년비'] || d['전월비'],
            plan: d['계획비'],
            unit: d['전월비'] ? 'month' : 'year'}}
          imgSrc={require('../img/con_bg' + (i + 1) + '.png')}
        />
      );
    })
  }
  </>;
};

export default Cards;
