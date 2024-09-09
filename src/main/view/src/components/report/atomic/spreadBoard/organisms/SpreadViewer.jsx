import {useSelector} from 'react-redux';
import {getWorkbookJSON, setWorkbookRef} from '../util/SpreadCore';
// import {SpreadSheets} from '@grapecity/spread-sheets-react';
import {Designer} from '@grapecity/spread-sheets-designer-react';
import {selectSpreadData}
  from 'redux/selector/SpreadSelector';
import useSpread from 'hooks/useSpread';
import {useEffect, useRef} from 'react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import {useDispatch} from 'react-redux';
import SpreadSlice from 'redux/modules/SpreadSlice';
import useSpreadRibbon from './useSpreadRibbon';
const theme = getTheme();

const StyledWrapper = styled(Wrapper)`
  height: 100%;
  width: calc(100% - 10px);
  flex: 1;
  background: #f5f6fa;
  min-height: 0px;
  overflow: hidden;
  border: 1px solid ${theme.color.gray200};
  border-radius: 10px;
  text-align: left;
`;

const StatusBar = styled('div')`
  bottom: 0;
  height: 25px;
  width: 100%;
  position: relative;
  float: left;
`;

const SpreadViewer = ({reportId}) => {
  const spreadData = useSelector((state) => selectSpreadData(state, reportId));
  const {setSpreadData} = SpreadSlice.actions;
  const {bindData, setExcelFile, sheetChangedListener} =
  useSpread();
  const dispatch = useDispatch();
  const {setRibbonRemoveFileMenu} = useSpreadRibbon();

  const workbookRef = useRef();
  // Spread 파일 로딩 상태 표시. 0: 미로딩, 1: 파일 로딩중, 2: 파일 로딩 완료
  const fileLoadingState = useRef(0);
  const prevData = useRef();

  useEffect(() => {
    if (fileLoadingState.current) return;
    const workbookJSON = getWorkbookJSON(reportId);
    fileLoadingState.current = 1;

    const startTime = new Date();

    console.log('파일 불러오기 시작');
    workbookRef.current.designer.getWorkbook().fromJSON(workbookJSON);
    setExcelFile(reportId).then(() => {
      console.log('파일 불러오기 완료. 걸린 시간: ' + (new Date() - startTime) + 'ms');
      fileLoadingState.current = 2;
    }).catch((e) => {
      console.log(e);
    });
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
      <Designer
        style={{
          height: 'calc(100% - 25px)'
        }}
        className={'dx-drawer-shader'}
        ref={workbookRef}
        designerInitialized={(designer) => {
          designer.setConfig(setRibbonRemoveFileMenu());
          designer.getWorkbook().options.allowCopyPasteExcelStyle = false;
          designer.getWorkbook().options.allowExtendPasteRange = true;
          designer.getWorkbook().options.incrementalCalculation = true;
          designer.getWorkbook().options.iterativeCalculation = true;
          designer.getWorkbook()
              .options.iterativeCalculationMaximumIterations = 100;


          setWorkbookRef(workbookRef);
          sheetChangedListener(designer);
          // initSpreadBar(designer, reportId);
        }}
        styleInfo={{
          width: '100%',
          height: '100%'
        }}
      >
      </Designer>
      <StatusBar
        id={'statusBar' + reportId}
      />
    </StyledWrapper>
  );
};

export default SpreadViewer;
