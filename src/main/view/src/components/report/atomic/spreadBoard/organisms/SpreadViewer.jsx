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
import {useDispatch} from 'react-redux';
import SpreadSlice from 'redux/modules/SpreadSlice';

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
  const {setSpreadData} = SpreadSlice.actions;
  const {bindData, setExcelFile} = useSpread();
  const dispatch = useDispatch();

  const workbookRef = useRef();
  const file = useRef();
  const prevData = useRef();

  useEffect(() => {
    if (file.current) return;
    const workbookJSON = getWorkbookJSON(reportId);
    file.current = true;
    workbookRef.current.spread.fromJSON(workbookJSON);
    setExcelFile(reportId);
  }, []);

  useEffect(() => {
    if (_.isEqual(prevData.current, spreadData) ||
      spreadData === 0) return;
    prevData.current = spreadData;
    bindData(_.cloneDeep(spreadData), workbookRef.current.spread);
    dispatch(setSpreadData({reportId, data: 0}));
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
