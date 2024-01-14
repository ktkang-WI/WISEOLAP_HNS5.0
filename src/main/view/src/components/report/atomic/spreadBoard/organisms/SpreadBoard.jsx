import {useDispatch} from 'react-redux';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import './spreadBoard.css';
import spreadDefaultElement from './SpreadDefaultElement';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSpread from 'hooks/useSpread';
import {selectSheets} from 'redux/selector/SpreadSelector';
import store from 'redux/modules';
import {useEffect} from 'react';

const SpreadBoard = () => {
  const dispatch = useDispatch();
  const {setSpread} = SpreadSlice.actions;
  const {setRibbonSetting} = spreadDefaultElement();
  const config = setRibbonSetting();
  const {sheetNameChangedListener, sheetChangedListener} = useSpread();

  useEffect(() => {
    const sheets = selectSheets(store.getState());
    const reportId = selectCurrentReportId(store.getState());
    const newDesigner = new sheets.Designer.Designer(document
        .getElementById('spreadWrapper'), config);

    dispatch(setSpread({
      reportId: reportId,
      bindingInfos: {},
      designer: newDesigner
    }));

    sheetNameChangedListener();
    sheetChangedListener();
  });

  return (
    <Wrapper id='spreadWrapper'
      style={{width: '100%', height: 'calc(100% - 40px)'}}>
    </Wrapper>
  );
};

export default SpreadBoard;
