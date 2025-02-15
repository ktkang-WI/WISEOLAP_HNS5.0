import './spreadBoard.css';
import useSpreadRibbon from './useSpreadRibbon';
import {useEffect, useRef} from 'react';
import {Designer} from '@grapecity/spread-sheets-designer-react';
import {getWorkbookJSON,
  insertWorkbookJSON,
  setDesignerRef
}
  from 'components/report/atomic/spreadBoard/util/SpreadCore';
import {useSelector} from 'react-redux';
import {selectBindingInfos, selectCurrentSpreadData}
  from 'redux/selector/SpreadSelector';
import useSpread from 'hooks/useSpread';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import {selectCurrentConfigure} from 'redux/selector/ConfigSelector';
import useModal from 'hooks/useModal';
import localizedString from 'config/localization';

const theme = getTheme();

const StyledWrapper = styled(Wrapper)`
  height: 100%;
  width: calc(100% - 10px);
  flex: 1;
  background: #f5f6fa;
  display: flex;
  min-height: 0px;
  margin-bottom: 0px;
  border: 1px solid ${theme.color.gray200};
  border-radius: 10px;
  overflow: hidden;
  text-align: left;

  .name-box-selector {
    height: 21px;
  }

  .gc-ribbon-bar .ribbon-navigation .ribbon-navigation-item {
    border-radius: 8px 8px 0px 0px;
  }
`;

const SpreadBoard = () => {
  const spreaRef = useRef();
  // hook
  const {
    sheetChangedListener,
    calculationProgressListener,
    sheetNameChangedListener,
    bindData,
    hnsDrmUpload
  } = useSpread();
  const {alert} = useModal();
  const {setRibbonSetting} = useSpreadRibbon();
  const currentReportId = useSelector(selectCurrentReportId);
  const spreadData = useSelector(selectCurrentSpreadData);
  const config = useSelector(selectCurrentConfigure);
  const bindingInfos = useSelector(selectBindingInfos);

  const checkValidate = (datasets) =>{
    const noDataDatasetNms = [];
    datasets.map((dataset) => {
      if (spreadData[dataset]?.rowData?.length == 0) {
        noDataDatasetNms.push(bindingInfos[dataset].datasetNm);
      }
    });
    return noDataDatasetNms.toString();
  };

  useEffect(() => {
    setDesignerRef(spreaRef);
  }, []);


  useEffect(() => {
    const datasets = Object.keys(spreadData);
    if (datasets.length > 0) {
      if (checkValidate(datasets) !== '') {
        alert(localizedString.spreadNoData + checkValidate(datasets) + ')');
      }

      bindData(spreadData);
    }
  }, [spreadData]);

  useEffect(() => {
    const workbookJSON = getWorkbookJSON(currentReportId);
    spreaRef.current.designer.getWorkbook().fromJSON(workbookJSON);
  }, [currentReportId]);

  const handleFileChange = async (event) => {
    console.log('selection file');
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      try {
        hnsDrmUpload(selectedFile);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleFileInputClick = (event) => {
    event.target.value = null;
  };

  useEffect(() => {
    if (spreaRef?.current?.designer) {
      spreaRef.current.designer.setConfig(setRibbonSetting());
    }
  }, [config]);

  return (
    <StyledWrapper className='section board'>
      <Designer
        className={'dx-drawer-shader'}
        ref={spreaRef}
        designerInitialized={(designer) => {
          if (designer) {
            designer.setConfig(setRibbonSetting());
            designer.getWorkbook().options.allowCopyPasteExcelStyle = false;
            designer.getWorkbook().options.allowExtendPasteRange = true;
            designer.getWorkbook().options.incrementalCalculation = true;
            designer.getWorkbook().options.iterativeCalculation = true;
            designer.getWorkbook()
                .options.iterativeCalculationMaximumIterations = 100;

            insertWorkbookJSON({
              reportId: currentReportId,
              workbookJSON: designer.getWorkbook().toJSON()
            });
            sheetChangedListener(designer.getWorkbook());
            // 수식 계산 시 progressBar 보이도록 수정
            calculationProgressListener(designer.getWorkbook());
            sheetNameChangedListener(designer);
          }
        }}
        styleInfo={{
          width: '100%',
          height: '100%'
        }}
      >
      </Designer>
      <input
        type='file'
        id='fileInput'
        accept='.xlsx, xls'
        style={{display: 'none'}}
        onChange={handleFileChange}
        onClick={handleFileInputClick}
      />
    </StyledWrapper>
  );
};

export default SpreadBoard;
