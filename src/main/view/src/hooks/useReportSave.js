import {selectDataset} from 'redux/selector/DatasetSelector';
import {selectItem} from 'redux/selector/ItemSelector';
import {selectCurrentReportId}
  from 'redux/selector/ReportSelector';
import store from 'redux/modules';
import {addReport, deleteReport} from 'models/report/Report';
import {useDispatch} from 'react-redux';
import ReportSlice from 'redux/modules/ReportSlice';
import ItemSlice from 'redux/modules/ItemSlice';
import LayoutSlice from 'redux/modules/LayoutSlice';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {selectLayout} from 'redux/selector/LayoutSelector';
import ParameterSlice from 'redux/modules/ParameterSlice';
import {selectParameter} from 'redux/selector/ParameterSelector';
import useModal from './useModal';

const useReportSave = () => {
  const {alert} = useModal();
  const dispatch = useDispatch();
  const {updateReport, updateSelectedReportId, deleteReportNInit} =
  ReportSlice.actions;
  const {changeItemReportId, deleteItemNInit} = ItemSlice.actions;
  const {changeLayoutReportId, deleteLayoutNInit} = LayoutSlice.actions;
  const {changeDatasetReportId, deleteDatasetNInit} = DatasetSlice.actions;
  const {changeParameterReportId, deleteParameterNInit} =
  ParameterSlice.actions;
  /**
   * 저장에 필요한 파라미터 생성
   * @param {JSON} dataSource 저장에 필요한 instance 배열
   * @return {JSON} parameter
   */
  const generateParameter = (dataSource) => {
    const param = {};
    param.reportId = dataSource.reportId;
    param.reportNm = dataSource.reportNm;
    param.fldId = dataSource.fldId;
    param.fldType = dataSource.fldType;
    param.fldName = dataSource.fldName;
    param.reportOrdinal = dataSource.reportOrdinal;
    // TODO: reportType 비정형 개발 시 고려 우선 'DashAny' 로 하드 코딩
    // param.reportType = 'DashAny';
    param.reportTag = dataSource.reportTag;
    param.reportDesc = dataSource.reportDesc;
    param.chartXml = JSON.stringify(selectItem(store.getState()));
    param.layoutXml = JSON.stringify(selectLayout(store.getState()));
    param.datasetXml = JSON.stringify(selectDataset(store.getState()));
    param.paramXml = JSON.stringify(selectParameter(store.getState()));
    param.reportSubTitle = dataSource.reportSubTitle;
    param.reportXml = JSON.stringify({
      reportId: param.reportId,
      options: param
    });

    return param;
  };

  /**
   * 보고서 저장
   * @param {JSON} dataSource 저장에 필요한 Modal dataSource
   */
  const saveReport = (dataSource) => {
    const param = generateParameter(dataSource);

    addReport(param, (response) => {
      if (response.status != 200) {
        return;
      }
      const currentReportId = selectCurrentReportId(store.getState());
      const reportId = {
        prevId: currentReportId,
        newId: response.data.reportId
      };
      const report = {
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
    });
  };

  const removeReport = (reportId) => {
    const param = {reportId: reportId};
    deleteReport(param, (response) => {
      if (response.status != 200) {
        return;
      }
      dispatch(deleteReportNInit(reportId));
      dispatch(deleteItemNInit(reportId));
      dispatch(deleteLayoutNInit(reportId));
      dispatch(deleteDatasetNInit(reportId));
      dispatch(deleteParameterNInit(reportId));
      dispatch(updateSelectedReportId({reportId: 0}));
      alert('보고서를 삭제했습니다.');
    });
  };

  return {
    saveReport,
    removeReport
  };
};

export default useReportSave;
