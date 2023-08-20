import {styled} from 'styled-components';
import ReportTitleTab from '../molecules/ReportTitleTab';

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
  return (
    <Wrapper>
      <ReportTitleTab>새 보고서</ReportTitleTab>
      {/* <ReportTitleTab>새 보고서</ReportTitleTab> */}
    </Wrapper>
  );
};

export default ReportTitleTabs;
