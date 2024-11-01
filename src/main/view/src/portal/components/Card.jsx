const Card = ({title, amount, percentData, imgSrc}) => {
  const piece = title.split('(');
  const _title = piece[0];
  const _unit = '(' + piece[1];

  const getColor = (data) => {
    if (data) {
      if (data == '0%') {
        return '';
      } else if (data.startsWith('-')) {
        return 'red';
      } else {
        return 'blue';
      }
    } else {
      return '';
    }
  };

  const getValue = (data) => {
    if (data.startsWith('-')) {
      return data.replace('-', '△');
    } else {
      return '+' + data;
    }
  };

  return (
    <div className="pay_box">
      <div>
        <p className="pay_title">{_title} <br /><span>{_unit}</span></p>
        <p className="pay">{(amount * 1).toLocaleString()}</p>
      </div>
      <div>
        <img src={imgSrc} alt="" />
        <div className="percent_box">
          {percentData.previous &&
            <p>전년比 : <span className={getColor(percentData.previous)}>
              {getValue(percentData.previous)}
            </span></p>
          }
          {percentData.plan &&
            <p>계획比 : <span className={getColor(percentData.plan)}>
              {getValue(percentData.plan)}
            </span></p>
          }
        </div>
      </div>
    </div>
  );
};


export default Card;
