import {selectCurrentReport, selectCurrentReportId}
  from 'redux/selector/ReportSelector';
import store from 'redux/modules';
import {deleteReport} from 'models/report/Report';
import {useDispatch} from 'react-redux';
import ReportSlice from 'redux/modules/ReportSlice';
import ItemSlice from 'redux/modules/ItemSlice';
import LayoutSlice from 'redux/modules/LayoutSlice';
import DatasetSlice from 'redux/modules/DatasetSlice';
import ParameterSlice from 'redux/modules/ParameterSlice';
import {selectCurrentInformationas} from 'redux/selector/ParameterSelector';
import useModal from './useModal';
import {selectCurrentReportType} from 'redux/selector/ConfigSelector';
import {selectCurrentItems} from 'redux/selector/ItemSelector';
import {selectRootLayout} from 'redux/selector/LayoutSelector';
import {selectRootDataset} from 'redux/selector/DatasetSelector';
import ReportType from 'components/designer/util/ReportType';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectBindingInfos} from 'redux/selector/SpreadSelector';
import useSpread from './useSpread';
import useFile from 'components/utils/useFile';
// import { useSelector } from 'react-redux';

const useReportSave = () => {
  const {alert} = useModal();
  const dispatch = useDispatch();
  const {createReportBlob} = useSpread();
  const {fileUpload} = useFile();
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
    initSpread
  } = SpreadSlice.actions;
  // const reportId = useSelector(selectCurrentReportId);
  /**
   * 저장에 필요한 파라미터 생성
   * @param {JSON} dataSource 저장에 필요한 instance 배열
   * @return {JSON} parameter
   */
  const generateParameter = (dataSource) => {
    const reportType = selectCurrentReportType(store.getState());
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
    param.reportSubTitle = dataSource.reportSubTitle;
    param.chartXml = JSON.stringify(selectCurrentItems(store.getState()));
    param.layoutXml = JSON.stringify(selectRootLayout(store.getState()));
    param.datasetXml = JSON.stringify(selectRootDataset(store.getState()));
    param.paramXml = JSON.stringify(
        selectCurrentInformationas(store.getState()));
    if (reportType === ReportType.EXCEL) {
      param.reportXml = JSON.stringify(selectBindingInfos(store.getState()));
    } else {
      param.reportXml = JSON.stringify(selectCurrentReport(store.getState()));
    }
    return param;
  };

  /**
   * 보고서 저장
   * @param {JSON} response 저장에 필요한 Modal dataSource
   */
  const saveReport = (response) => {
    if (response.data.reportType === ReportType.EXCEL) {
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
    alert('보고서를 저장했습니다.');
  };

  const removeReport = (reportId, reportType) => {
    const param = {reportId: reportId};
    deleteReport(param, (response) => {
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
      alert('보고서를 삭제했습니다.');
    });
  };

  const reload = (reportId, designer) => {
    dispatch(initReport(reportId));
    dispatch(initDatasets(reportId));
    dispatch(initItems(reportId));
    dispatch(initLayout({reportId: reportId, designer: designer}));
    dispatch(initParameter(reportId));
    dispatch(initSpread(reportId));
  };

  return {
    generateParameter,
    saveReport,
    removeReport,
    reload
  };
};

export default useReportSave;
