import ReportTitlePanel from '../../Common/Panel/ReportTitlePanel';
import ReportTitleText from '../atom/ReportTitleText';

const ReportTitleTab = ({children, height}) => {
  return (
    <ReportTitlePanel height={height}>
      <ReportTitleText>
        {children}
      </ReportTitleText>
    </ReportTitlePanel>
  );
};

export default ReportTitleTab;
