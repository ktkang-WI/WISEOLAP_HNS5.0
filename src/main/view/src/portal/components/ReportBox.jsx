import excel from 'assets/image/icon/report/excel_file.png';
import adhoc from 'assets/image/icon/report/adhoc.png';
import dash from 'assets/image/icon/report/dash.png';
import {DesignerMode} from 'components/config/configType';

const iconMapper = {
  [DesignerMode.AD_HOC]: adhoc,
  [DesignerMode.DASHBOARD]: dash,
  [DesignerMode.EXCEL]: excel
};

const ReportBox = ({title, icon, date, report, href}) => {
  return (
    <li>
      <button type="button" onClick={() => {
        const newWindow = window.open(href, '_blank');
        if (newWindow) {
          newWindow.focus();
        }
      }}>
        <div className="txt">
          <p><img src={iconMapper[report.reportType]} alt="" /> {title}</p>
          <p>최종수정일자 : {date}</p>
          <p>최종 수정자: {report.modUserName}</p>
          <p>설명 : {report.reportDesc}</p>
        </div>
      </button>
    </li>
  );
};

export default ReportBox;
