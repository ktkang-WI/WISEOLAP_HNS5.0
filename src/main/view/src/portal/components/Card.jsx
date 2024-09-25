const Card = ({title, amount, percentData, imgSrc}) => {
  return (
    <div className="pay_box">
      <div>
        <p className="pay_title">{title} <br /><span>(만원)</span></p>
        <p className="pay">{amount}</p>
      </div>
      <div>
        <img src={imgSrc} alt="" />
        <div className="percent_box">
          <p>전년比 : <span className="red">{percentData.previous}</span></p>
          <p>계획比 : <span className="blue">{percentData.plan}</span></p>
        </div>
      </div>
    </div>
  );
};


export default Card;
