import {useSelector} from 'react-redux';
import {getWorkbookJSON, setWorkbookRef} from '../util/SpreadCore';
import {SpreadSheets} from '@grapecity/spread-sheets-react';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectBindingInfos, selectCurrentSpreadData}
  from 'redux/selector/SpreadSelector';
import useSpread from 'hooks/useSpread';
import store from 'redux/modules';
import {useEffect, useRef} from 'react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';

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
