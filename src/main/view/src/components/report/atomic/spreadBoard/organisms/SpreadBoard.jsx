
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useSelector} from 'react-redux';
import useSpread from 'hooks/useSpread';
import {Designer} from '@grapecity/spread-sheets-designer-react';
import './spreadBoard.css';
import {selectCurrentSpreadJS,
  selectSheets} from 'redux/selector/SpreadSelector';
import store from 'redux/modules';

const SpreadBoard = () => {
  const dispatch = useDispatch();
  const spreadSlice = SpreadSlice.actions;
  const selectedReportId = useSelector(selectCurrentReportId);
  const {setRibbonSetting} = useSpread();
  const config = setRibbonSetting();

  const redrawDesigner = useCallback(() => {
    const sheets = selectSheets(store.getState());
    const curr = selectCurrentSpreadJS(store.getState());
    new sheets.Designer.Designer(
        document.getElementById('test'), config);
    curr.destroy();
  }, []);

  const designerInitialized = useCallback((e) => {
    dispatch(spreadSlice.setSpreadJS({
      reportId: selectedReportId,
      spreadJS: e
    }));
  }, [selectedReportId]);

  return (
    <div id={'test'}>
      <Designer
        styleInfo={{width: '100%', height: 'calc(100% - 40px)'}}
        config={config}
        designerInitialized={designerInitialized}
      >
      </Designer>
    </div>
  );
};

export default SpreadBoard;
