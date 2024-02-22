import './spreadBoard.css';
import useSpreadRibbon from './useSpreadRibbon';
import {useEffect, useRef} from 'react';
import {Designer} from '@grapecity/spread-sheets-designer-react';
import {insertWorkbook, setDesigner, updateWorkbook}
  from 'components/report/atomic/spreadBoard/util/SpreadCore';
import {useSelector} from 'react-redux';
import {selectCurrentData} from 'redux/selector/SpreadSelector';
import useSpread from 'hooks/useSpread';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';

const SpreadBoard = () => {
  const spreaRef = useRef();
  // hook
  const {sheetChangedListener, sheetNameChangedListener} =
    useSpread();
  const config = useSpreadRibbon();
  const currentReportId = useSelector(selectCurrentReportId);
  const data = useSelector(selectCurrentData);

  useEffect(() => {

  }, [data]);

  useEffect(() => {
    updateWorkbook({
      reportId: currentReportId,
      workbook: spreaRef.current.designer.getWorkbook()
    });
  }, [currentReportId]);

  return (
    <Wrapper>
      <Designer
        ref={spreaRef}
        designerInitialized={(designer) => {
          designer.setConfig(config);
          setDesigner(designer);
          insertWorkbook({
            reportId: currentReportId,
            workbook: designer.getWorkbook()
          });
          sheetChangedListener(designer);
          sheetNameChangedListener(designer);
        }}
        styleInfo={{width: '100%', height: 'calc(100% - 40px)'}}
      >
      </Designer>
    </Wrapper>
  );
};

export default SpreadBoard;
