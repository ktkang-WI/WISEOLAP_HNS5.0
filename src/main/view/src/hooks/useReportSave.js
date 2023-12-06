import {selectDataset} from 'redux/selector/DatasetSelector';
import {selectItem} from 'redux/selector/ItemSelector';
import {selectCurrentReport, selectCurrentReportId}
  from 'redux/selector/ReportSelector';
import store from 'redux/modules';
import {addReport} from 'models/report/Report';
import {useDispatch} from 'react-redux';
import ReportSlice from 'redux/modules/ReportSlice';
import ItemSlice from 'redux/modules/ItemSlice';
import LayoutSlice from 'redux/modules/LayoutSlice';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {selectLayout} from 'redux/selector/LayoutSelector';

const useReportSave = () => {
  const dispatch = useDispatch();
  const {updateReport, updateSelectedReportId} = ReportSlice.actions;
  const {changeItemReportId} = ItemSlice.actions;
  const {changeLayoutReportId} = LayoutSlice.actions;
  const {changeDatasetReportId} = DatasetSlice.actions;
  /**
   * 저장에 필요한 파라미터 생성
   * @param {JSON} dataSource 저장에 필요한 instance 배열
   * @return {JSON} parameter
   */
  const generateParameter = (dataSource) => {
    const param = {};

    // TODO: 추후 저장/다른이름으로 저장 팝오버 mergy 후
    // 팝업창 으로 저장 할 경우 (새로 저장 or 다른이름으로 저장)에는
    // reportId 를 0 으로 하여 무조건 insert 하게 한다.
    param.reportId = selectCurrentReportId(store.getState());
    param.reportNm = dataSource.name;
    param.fldId = dataSource.fldId;
    param.fldType = dataSource.fldType;
    param.reportOrdinal = dataSource.order;
    // param.reportType = 'DashAny';
    param.reportTag = dataSource.tag;
    param.reportDesc = dataSource.description;
    param.reportXml = JSON.stringify(selectCurrentReport(store.getState()));
    param.chartXml = JSON.stringify(selectItem(store.getState()));
    param.layoutXml = JSON.stringify(selectLayout(store.getState()));
    param.datasetXml = JSON.stringify(selectDataset(store.getState()));
    param.paramXml = '{}';
    param.reportSubTitle = dataSource.subName;

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
        options: {...response.data}
      };

      dispatch(updateReport(report));

      dispatch(changeItemReportId(reportId));
      dispatch(changeLayoutReportId(reportId));
      dispatch(changeDatasetReportId(reportId));
      dispatch(updateSelectedReportId({reportId: reportId.newId}));
    });
  };

  return {
    saveReport
  };
};

export default useReportSave;
