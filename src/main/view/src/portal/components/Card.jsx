const Card = ({title, amount, percentData, imgSrc}) => {
  const piece = title.split('(');
  const _title = piece[0];
  const _unit = '(' + piece[1];

  // const getColor = (data) => {
  //   if (data) {
  //     if (data == '0%') {
  //       return '';
  //     } else if (data.startsWith('-')) {
  //       return 'red';
  //     } else {
  //       return 'blue';
  //     }
  //   } else {
  //     return '';
  //   }
  // };

  const getIcon = (data) => {
    if (data.startsWith('-')) {
      return '▲';
    } else if (data == '0%') {
      return '';
    } else {
      return '+';
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
            <p>전년比 : <span>{getIcon(percentData.previous)}</span>
              <span>
                {percentData.previous.replace('-', '')}
              </span>
            </p>
          }
          {percentData.plan &&
            <p>계획比 : <span>{percentData.plan}</span>
            </p>
          }
        </div>
      </div>
    </div>
  );
};


export default Card;
