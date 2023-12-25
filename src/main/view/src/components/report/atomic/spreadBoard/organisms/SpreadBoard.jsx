import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import '@grapecity/spread-sheets-resources-ko';
import '@grapecity/spread-sheets-designer-resources-ko';
import {Designer} from '@grapecity/spread-sheets-designer-react';
import
'@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css';
import '@grapecity/spread-sheets-designer';
import {useCallback, useRef} from 'react';
import {useDispatch} from 'react-redux';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useSelector} from 'react-redux';

const SpreadBoard = ({config}) => {
  const spreadRef = useRef();
  const dispatch = useDispatch();
  const spreadSlice = SpreadSlice.actions;
  const selectedReportId = useSelector(selectCurrentReportId);

  const designerInitialized = useCallback((e) => {
    setTimeout(() => {
    }, 3000);
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
      designerInitialized={() => designerInitialized}
    ></Designer>
  );
};

export default SpreadBoard;
