
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useSelector} from 'react-redux';
import {Designer} from '@grapecity/spread-sheets-designer-react';
import './spreadBoard.css';
import spreadDefaultElement from './SpreadDefaultElement';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
// import {selectCurrentWorkbook,
//   selectSheets} from 'redux/selector/SpreadSelector';
// import store from 'redux/modules';

const SpreadBoard = () => {
  const dispatch = useDispatch();
  const spreadSlice = SpreadSlice.actions;
  const selectedReportId = useSelector(selectCurrentReportId);
  const {setRibbonSetting} = spreadDefaultElement();
  const config = setRibbonSetting();

  const designerInitialized = useCallback((e) => {
    dispatch(spreadSlice.setWorkbook({
      reportId: selectedReportId,
      workbook: e
    }));
  }, [selectedReportId]);

  return (
    <Wrapper id='test'>
      <Designer
        styleInfo={{width: '100%', height: 'calc(100% - 40px)'}}
        config={config}
        designerInitialized={designerInitialized}
      >
      </Designer>
    </Wrapper>
  );
};

export default SpreadBoard;
