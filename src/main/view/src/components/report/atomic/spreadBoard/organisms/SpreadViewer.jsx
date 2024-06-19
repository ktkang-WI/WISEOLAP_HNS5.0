import {useSelector} from 'react-redux';
import {getWorkbookJSON, setWorkbookRef} from '../util/SpreadCore';
import {SpreadSheets} from '@grapecity/spread-sheets-react';
// import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectSpreadData}
  from 'redux/selector/SpreadSelector';
import useSpread from 'hooks/useSpread';
import {useEffect, useRef} from 'react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';

const theme = getTheme();

const StyledWrapper = styled(Wrapper)`
  height: 100%;
  width: calc(100% - 10px);
  flex: 1;
  background: #f5f6fa;
  display: flex;
  min-height: 0px;
  border: 1px solid ${theme.color.gray200};
  border-radius: 10px;
  overflow: hidden !important;
  text-align: left;
`;

const SpreadViewer = ({reportId}) => {
  const spreadData = useSelector((state) => selectSpreadData(state, reportId));
  const currentReportId = useSelector(selectCurrentReportId);
  const {bindData, setExcelFile} = useSpread();

  const workbookRef = useRef();

  useEffect(() => {
    // 컴포넌트 생성될 때 1회만 파일 열기
    const workbookJSON = getWorkbookJSON(reportId);
    workbookRef.current.spread.fromJSON(workbookJSON);
    setExcelFile(reportId);
  }, []);

  useEffect(() => {
    if (reportId != currentReportId) return;

    bindData(spreadData, workbookRef.current.spread);
  }, [spreadData]);

  return (
    <StyledWrapper
      className='section board'
    >
      <SpreadSheets
        ref={workbookRef}
        workbookInitialized={() => {
          setWorkbookRef(workbookRef);
        }}
      />
    </StyledWrapper>
  );
};

export default SpreadViewer;
