const ReportBox = ({title, icon, date, description, href}) => {
  return (
    <li>
      <button type="button" onClick={() => {
        const newWindow = window.open(href, '_blank');
        if (newWindow) {
          newWindow.focus();
        }
      }}>
        <img src={icon} alt="" />
        <div className="txt">
          <p>{title}</p>
          <p>최종수정일자 : {date} 주석 : {description}</p>
        </div>
      </button>
    </li>
  );
};

export default ReportBox;
