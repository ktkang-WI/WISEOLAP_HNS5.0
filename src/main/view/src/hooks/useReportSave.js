import {selectRootDataset} from 'redux/selector/DatasetSelector';
import {selectRootItem} from 'redux/selector/ItemSelector';
import {selectCurrentReportId}
  from 'redux/selector/ReportSelector';
import store from 'redux/modules';
import {deleteReport} from 'models/report/Report';
import {useDispatch} from 'react-redux';
import ReportSlice from 'redux/modules/ReportSlice';
import ItemSlice from 'redux/modules/ItemSlice';
import LayoutSlice from 'redux/modules/LayoutSlice';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {selectRootLayout} from 'redux/selector/LayoutSelector';
import ParameterSlice from 'redux/modules/ParameterSlice';
import {selectCurrentInformationas} from 'redux/selector/ParameterSelector';
import useModal from './useModal';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectBindingInfos} from 'redux/selector/SpreadSelector';
import useSpread from './useSpread';
import useFile from './useFile';
import {DesignerMode} from 'components/config/configType';
// import { useSelector } from 'react-redux';

const useReportSave = () => {
  const {alert} = useModal();
  const dispatch = useDispatch();
  const {createReportBlob} = useSpread();
  const {fileUpload, fileDelete} = useFile();
  const {
    updateReport,
    updateSelectedReportId,
    deleteReportForDesigner,
    initReport
  } = ReportSlice.actions;
  const {
    changeItemReportId,
    deleteItemForDesigner,
    initItems
  } = ItemSlice.actions;
  const {
    changeLayoutReportId,
    deleteLayoutForDesigner,
    initLayout
  } = LayoutSlice.actions;
  const {
    changeDatasetReportId,
    deleteDatasetForDesigner,
    initDatasets
  } = DatasetSlice.actions;
  const {
    changeParameterReportId,
    deleteParameterForDesigner,
    initParameter
  } = ParameterSlice.actions;
  const {
    initSpread,
    deleteSpread,
    changeSpreadReportId
  } = SpreadSlice.actions;
  /**
   * 저장에 필요한 파라미터 생성
   * @param {JSON} dataSource 저장에 필요한 instance 배열
   * @return {JSON} parameter
   */
  const generateParameter = (dataSource) => {
    const reportType = selectCurrentDesignerMode(store.getState());
    const param = {};
    param.reportId = dataSource.reportId;
    param.reportNm = dataSource.reportNm;
    param.fldId = dataSource.fldId;
    param.fldType = dataSource.fldType;
    param.fldName = dataSource.fldName;
    param.reportOrdinal = dataSource.reportOrdinal;
    param.reportType = reportType;
    param.reportTag = dataSource.reportTag;
    param.reportDesc = dataSource.reportDesc;
    const chartXml = selectRootItem(store.getState());
    const newChartXml = _.cloneDeep(chartXml);
    newChartXml.items.forEach((item) => delete item['mart']);
    param.chartXml = JSON.stringify(newChartXml);
    param.layoutXml = JSON.stringify(selectRootLayout(store.getState()));
    param.datasetXml = JSON.stringify(selectRootDataset(store.getState()));
    param.paramXml = JSON.stringify(
        selectCurrentInformationas(store.getState()));
    if (reportType === DesignerMode['SPREAD_SHEET']) {
      param.reportXml = JSON.stringify(selectBindingInfos(store.getState()));
    } else {
      param.reportXml = JSON.stringify({
        reportId: param.reportId,
        options: param
      });
    }
    param.reportSubTitle = dataSource.reportSubTitle;
    return param;
  };

  /**
   * 보고서 저장
   * @param {JSON} response 저장에 필요한 Modal dataSource
   */
  const saveReport = (response) => {
    if (response.data.reportType === DesignerMode['SPREAD_SHEET']) {
      createReportBlob().then((bolb) => fileUpload(
          bolb, {fileName: response.data.reportId + '.xlsx'}));
    }
    const currentReportId = selectCurrentReportId(store.getState());
    const reportId = {
      prevId: currentReportId,
      newId: response.data.reportId
    };
    const report = {
      prevId: currentReportId,
      reportId: reportId.newId,
      options: response.data
    };

    dispatch(updateReport(report));

    dispatch(changeItemReportId(reportId));
    dispatch(changeLayoutReportId(reportId));
    dispatch(changeDatasetReportId(reportId));
    dispatch(changeParameterReportId(reportId));
    dispatch(updateSelectedReportId({reportId: reportId.newId}));
    dispatch(changeSpreadReportId(reportId));
    alert('보고서를 저장했습니다.');
  };

  const removeReport = (reportId, reportType) => {
    const param = {reportId: reportId};
    deleteReport(param).then((response) => {
      if (response.status != 200) {
        return;
      }
      dispatch(deleteReportForDesigner(reportId));
      dispatch(deleteItemForDesigner(reportId));
      dispatch(deleteLayoutForDesigner(
          {reportId: reportId, reportType: reportType}
      ));
      dispatch(deleteDatasetForDesigner(reportId));
      dispatch(deleteParameterForDesigner(reportId));
      dispatch(deleteSpread(reportId));
      reload(reportType);
      if (reportType === DesignerMode['SPREAD_SHEET']) {
        fileDelete({fileName: reportId + '.xlsx'});
      }
      alert('보고서를 삭제했습니다.');
    });
  };

  const reload = (designerMode) => {
    dispatch(initReport(designerMode));
    dispatch(initDatasets());
    dispatch(initItems(designerMode));
    dispatch(initLayout(designerMode));
    dispatch(initParameter());
    dispatch(initSpread());
  };

  return {
    generateParameter,
    saveReport,
    removeReport,
    reload
  };
};

export default useReportSave;
