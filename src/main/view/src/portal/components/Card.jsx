const Card = ({title, amount, percentData, imgSrc}) => {
  const piece = title.split('(');
  const _title = piece[0];
  const _unit = '(' + piece[1];
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
            <p>전년比 : <span className="red">{percentData.previous}</span></p>
          }
          {percentData.plan &&
            <p>계획比 : <span className="blue">{percentData.plan}</span></p>
          }
        </div>
      </div>
    </div>
  );
};


export default Card;
