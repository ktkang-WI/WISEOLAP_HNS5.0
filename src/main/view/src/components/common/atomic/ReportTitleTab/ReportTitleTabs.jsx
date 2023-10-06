import {styled} from 'styled-components';
import ReportTitleTab from './molecules/ReportTitleTab';
import {selectReports} from 'redux/selector/ReportSelector';
import {useSelector} from 'react-redux';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  min-width: 200px;
  @media screen and (max-width: 720px) {
    display: none;
  }
`;

// TODO: 추후 데이터 연동시 수정 예정
const ReportTitleTabs = () => {
  const reports = useSelector(selectReports);

  return (
    <Wrapper>
      {reports.map((report) =>
        <ReportTitleTab key={report.reportId}>
          {report.options.reportNm}
        </ReportTitleTab>
      )}
    </Wrapper>
  );
};

export default ReportTitleTabs;
