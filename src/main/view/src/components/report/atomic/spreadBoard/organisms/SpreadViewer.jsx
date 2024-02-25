import {useSelector} from 'react-redux';
import {getWorkbookJSON, setWorkbookRef} from '../util/SpreadCore';
import {useRef} from 'react';
import {SpreadSheets} from '@grapecity/spread-sheets-react';
import {useEffect} from 'react';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectBindingInfos, selectCurrentSpreadData}
  from 'redux/selector/SpreadSelector';
import useSpread from 'hooks/useSpread';
import store from 'redux/modules';

const SpreadViewer = () => {
  const reportId = useSelector(selectCurrentReportId);
  const spreadData = useSelector(selectCurrentSpreadData);
  const {bindData} = useSpread();
  const workbookRef = useRef();

  useEffect(() => {
    const workbookJSON = getWorkbookJSON(reportId);
    workbookRef.current.spread.fromJSON(workbookJSON);
  }, [reportId]);

  useEffect(() => {
    const bindingInfos = selectBindingInfos(store.getState());
    Object.keys(spreadData).forEach((datasetId) => {
      const bindingInfo = bindingInfos[datasetId];
      bindData({
        rowData: spreadData[datasetId],
        bindingInfo: bindingInfo
      });
    });
  }, [spreadData]);

  return (
    <SpreadSheets
      ref={workbookRef}
      workbookInitialized={() => {
        setWorkbookRef(workbookRef);
      }}
    >
    </SpreadSheets>
  );
};

export default SpreadViewer;
