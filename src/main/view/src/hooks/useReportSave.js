import {selectDataset} from 'redux/selector/DatasetSelector';
import {selectItem} from 'redux/selector/ItemSelector';
import {selectCurrentReportId}
  from 'redux/selector/ReportSelector';
import store from 'redux/modules';
import {addReport} from 'models/report/Report';
import {useDispatch} from 'react-redux';
import ReportSlice from 'redux/modules/ReportSlice';
import ItemSlice from 'redux/modules/ItemSlice';
import LayoutSlice from 'redux/modules/LayoutSlice';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {selectLayout} from 'redux/selector/LayoutSelector';
import ParameterSlice from 'redux/modules/ParameterSlice';
import {selectParameter} from 'redux/selector/ParameterSelector';

const useReportSave = () => {
  const dispatch = useDispatch();
  const {updateReport, updateSelectedReportId} = ReportSlice.actions;
  const {changeItemReportId} = ItemSlice.actions;
  const {changeLayoutReportId} = LayoutSlice.actions;
  const {changeDatasetReportId} = DatasetSlice.actions;
  const {changeParameterReportId} = ParameterSlice.actions;
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
    });
  };

  return {
    saveReport
  };
};

export default useReportSave;
