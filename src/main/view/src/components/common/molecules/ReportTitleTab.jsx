import ReportTitlePanel from '../atoms/ReportTitlePanel';
import ReportTitleText from '../atoms/ReportTitleText';

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
