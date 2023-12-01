import {selectCurrentDataset} from 'redux/selector/DatasetSelector';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import {selectCurrentReport, selectCurrentReportId}
  from 'redux/selector/ReportSelector';
import store from 'redux/modules';
import {addReport} from 'models/report/Report';
import {useDispatch} from 'react-redux';
import ReportSlice from 'redux/modules/ReportSlice';
import ItemSlice from 'redux/modules/ItemSlice';
import LayoutSlice from 'redux/modules/LayoutSlice';
import DatasetSlice from 'redux/modules/DatasetSlice';

const useReportSave = () => {
  const dispatch = useDispatch();
  const {insertReport} = ReportSlice.actions;
  const {insertItemReportId} = ItemSlice.actions;
  const {insertLayoutReportId} = LayoutSlice.actions;
  const {insertDatasetReportId} = DatasetSlice.actions;
  /**
   * 저장에 필요한 파라미터 생성
   * @param {JSON} dataSource 저장에 필요한 instance 배열
   * @return {JSON} parameter
   */
  const generateParameter = (dataSource) => {
    const param = {...dataSource};

    param.reportId = selectCurrentReportId(store.getState());
    param.reportType = 'DashAny';
    param.reportXML = JSON.stringify(selectCurrentReport(store.getState()));
    param.chartXML = JSON.stringify(selectCurrentItem(store.getState()));
    param.layoutXML = '';
    param.datasetXML = JSON.stringify(selectCurrentDataset(store.getState()));
    param.paramXML = '';

    param.regUserNo = '1001';
    param.regDt = '2023-11-08:04:41:46';

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
      const reportId = response.data.reportId;
      const report = {
        reportId: reportId,
        options: {...response.data}
      };
      dispatch(insertReport(report));
      dispatch(insertItemReportId(report));
      dispatch(insertLayoutReportId(report));
      dispatch(insertDatasetReportId(report));
    });
  };

  return {
    saveReport
  };
};

export default useReportSave;
