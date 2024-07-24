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
  // Spread 파일 로딩 상태 표시. 0: 미로딩, 1: 파일 로딩중, 2: 파일 로딩 완료
  const fileLoadingState = useRef(0);
  const prevData = useRef();

  useEffect(async () => {
    if (fileLoadingState.current) return;
    const workbookJSON = getWorkbookJSON(reportId);
    fileLoadingState.current = 1;

    const startTime = new Date();

    console.log('파일 불러오기 시작');
    workbookRef.current.spread.fromJSON(workbookJSON);
    await setExcelFile(reportId);
    console.log('파일 불러오기 완료. 걸린 시간: ' + (new Date() - startTime) + 'ms');
    fileLoadingState.current = 2;
  }, []);

  useEffect(() => {
    if (_.isEqual(prevData.current, spreadData) ||
      spreadData === 0) return;

    if (fileLoadingState.current == 2) {
      bindSpreadData();
      return;
    }

    const waitLoadFile = setInterval(() => {
      if (fileLoadingState.current == 2) {
        clearInterval(waitLoadFile);
        bindSpreadData();
      }
    }, 500);

    return () => clearInterval(waitLoadFile);
  }, [spreadData]);

  const bindSpreadData = () => {
    prevData.current = spreadData;
    console.log('데이터 로드 시작');
    bindData(_.cloneDeep(spreadData), workbookRef.current.spread);
    dispatch(setSpreadData({reportId, data: 0}));
    console.log('데이터 로드 완료');
  };

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
