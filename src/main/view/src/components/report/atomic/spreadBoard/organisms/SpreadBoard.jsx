
import {useCallback, useRef} from 'react';
import {useDispatch} from 'react-redux';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useSelector} from 'react-redux';
import useSpread from 'hooks/useSpread';
import {Designer} from '@grapecity/spread-sheets-designer-react';
import './spreadBoard.css';

const SpreadBoard = () => {
  const spreadRef = useRef();
  const dispatch = useDispatch();
  const spreadSlice = SpreadSlice.actions;
  const selectedReportId = useSelector(selectCurrentReportId);
  const {setRibbonSetting} = useSpread();

  // Ribbon custom 등록
  const config = setRibbonSetting();

  const designerInitialized = useCallback((e) => {
    dispatch(spreadSlice.setSpreadJS({
      reportId: selectedReportId,
      spreadJS: e.getWorkbook()
    }));
  }, [selectedReportId]);

  return (
    <Designer
      ref={spreadRef}
      styleInfo={{width: '100%', height: 'calc(100% - 40px)'}}
      config={config}
      designerInitialized={designerInitialized}
    ></Designer>
  );
};

export default SpreadBoard;
