import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useSelector} from 'react-redux';
import {Designer} from '@grapecity/spread-sheets-designer-react';
import './spreadBoard.css';
import spreadDefaultElement from './SpreadDefaultElement';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSpread from 'hooks/useSpread';

const SpreadBoard = () => {
  const dispatch = useDispatch();
  const spreadSlice = SpreadSlice.actions;
  const selectedReportId = useSelector(selectCurrentReportId);
  const {setRibbonSetting} = spreadDefaultElement();
  const config = setRibbonSetting();
  const {sheetNameChangedListener, sheetChangedListener} = useSpread();

  const designerInitialized = useCallback((e) => {
    dispatch(spreadSlice.setDesigner({
      reportId: selectedReportId,
      designer: e
    }));
    sheetNameChangedListener();
    sheetChangedListener();
  }, [selectedReportId]);

  return (
    <Wrapper id='test' style={{width: '100%', height: 'calc(100% - 40px)'}}>
      <Designer
        styleInfo={{width: '100%', height: '100%'}}
        config={config}
        designerInitialized={designerInitialized}
      >
      </Designer>
    </Wrapper>
  );
};

export default SpreadBoard;
