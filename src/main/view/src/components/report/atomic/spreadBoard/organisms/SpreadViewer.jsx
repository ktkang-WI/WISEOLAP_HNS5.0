import {useSelector} from 'react-redux';
import {getWorkbookJSON, setWorkbookRef} from '../util/SpreadCore';
import {SpreadSheets} from '@grapecity/spread-sheets-react';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectCurrentSpreadData}
  from 'redux/selector/SpreadSelector';
import useSpread from 'hooks/useSpread';
import {useEffect, useRef, useState} from 'react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';

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
  const spreadId = reportId || useSelector(selectCurrentReportId);
  const spreadData = useSelector(selectCurrentSpreadData);
  const {bindData, setExcelFile} = useSpread();
  // 뷰어에서 처음 열 때만 바인딩
  const [bindingCount, setBindingCount] = useState(0);
  const workbookRef = useRef();

  useEffect(() => {
    if (bindingCount == 2) return;
    const workbookJSON = getWorkbookJSON(spreadId);
    workbookRef.current.spread.fromJSON(workbookJSON);
    setExcelFile(spreadId);
    setBindingCount((state) => state + 1);
  }, [spreadId]);

  useEffect(() => {
    if (bindingCount == 2) return;
    bindData(spreadData);
    setBindingCount((state) => state + 1);
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
