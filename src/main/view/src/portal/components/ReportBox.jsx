const ReportBox = ({title, icon, date, report, href}) => {
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
          <p>최종수정일자 : {date}</p>
          <p>최종 수정자: {report.modUserName}</p>
          <p>주석 : {report.reportDesc}</p>
        </div>
      </button>
    </li>
  );
};

export default ReportBox;
