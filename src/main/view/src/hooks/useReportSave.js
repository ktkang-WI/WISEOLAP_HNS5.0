import {selectRootDataset} from 'redux/selector/DatasetSelector';
import {selectRootItem} from 'redux/selector/ItemSelector';
import {selectCurrentReportId, selectReports}
  from 'redux/selector/ReportSelector';
import store, {getReportInitialState} from 'redux/modules';
import {useDispatch} from 'react-redux';
import ReportSlice from 'redux/modules/ReportSlice';
import ItemSlice from 'redux/modules/ItemSlice';
import LayoutSlice from 'redux/modules/LayoutSlice';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {selectRootLayout} from 'redux/selector/LayoutSelector';
import ParameterSlice from 'redux/modules/ParameterSlice';
import {selectCurrentInformationas,
  selectRootParameter} from 'redux/selector/ParameterSelector';
import useModal from './useModal';
import {selectCurrentDesignerMode, selectEditMode}
  from 'redux/selector/ConfigSelector';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectSpreadMeta}
  from 'redux/selector/SpreadSelector';
import {AdHocLayoutTypes, ConvertDesignerMode, DesignerMode, EditMode}
  from 'components/config/configType';
import models from 'models';
import localizedString from 'config/localization';
import {useSelector} from 'react-redux';
import {makeMart, makeAdHocItemMart}
  from 'components/report/item/util/martUtilityFactory';
import ItemManager from 'components/report/item/util/ItemManager';
import {makeFieldIcon} from 'components/dataset/utils/DatasetUtil';
import useQueryExecute from './useQueryExecute';
import DatasetType from 'components/dataset/utils/DatasetType';
import {initWorkkbookJSONs}
  from 'components/report/atomic/spreadBoard/util/SpreadCore';

const useReportSave = () => {
  const dispatch = useDispatch();
  const {alert} = useModal();
  const {executeItems, executeSpread} = useQueryExecute();
  const editMode = useSelector(selectEditMode);

  const reportActions = ReportSlice.actions;
  const itemActions = ItemSlice.actions;
  const layoutActions = LayoutSlice.actions;
  const datasetActions = DatasetSlice.actions;
  const parameterActions = ParameterSlice.actions;
  const spreadActions = SpreadSlice.actions;

  const currentReportId = useSelector(selectCurrentReportId);

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
    if (reportType === DesignerMode['EXCEL']) {
      param.reportXml = JSON.stringify(selectSpreadMeta(store.getState()));
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
   * 저장 후 새로운 ReportSlice 의 state 를 생성해줍니다.
   * ReportSlice state 초기값 (initialState)의 구조에 맞게 state를 생성해줍니다.
   * @param {JSON} data 저장 후 REPORT_MSTR 테이블에 저장된 보고서 정보
   * @return {JSON} report 새로 추가되거나 업데이트 할 ReportSlice 의 state
   */
  const generateReport = (data) => {
    const report = _.cloneDeep(getReportInitialState());

    const generateOptions = () => {
      const options = report.reports[0].options;

      options.reportNm = data.reportNm;
      options.reportSubTitle = data.reportSubTitle;
      options.fldId = data.fldId;
      options.fldName = data.fldName;
      options.fldType = data.fldType;
      options.reportOrdinal = data.reportOrdinal;
      options.reportTag = data.reportTag;
      options.reportDesc = data.reportDesc;
      options.path = data.path;
      options.reportType = ConvertDesignerMode[data.reportType];

      return options;
    };

    const generateReports = () => {
      const reports = report.reports;

      reports[0].reportId = data.reportId;
      reports[0].options = generateOptions();

      return reports;
    };

    report.selectedReportId = data.reportId;
    report.reports = generateReports();

    return report;
  };

  // 보고서 저장 시 필요한 파라미터 정리.
  const generateParam = (response) => {
    const reportId = {
      prevId: currentReportId,
      newId: response.report.reportId
    };

    const report = generateReport(response.report);

    return {reportId: reportId, report: report};
  };

  /**
   * 보고서 저장 (새로운 보고서를 추가 합니다.)
   * @param {JSON} response 저장 후 REPORT_MSTR 테이블에 저장된 보고서 정보
   */
  const addReport = (response) => {
    const reportParams = generateParam(response);

    if (editMode == EditMode.VIEWER) {
      dispatch(reportActions.changeReportViewer(reportParams));
    } else {
      // 디자이너
      dispatch(reportActions.changeReport(reportParams.report));
    }
    dispatch(itemActions.changeItemReportId(reportParams.reportId));
    dispatch(layoutActions.changeLayoutReportId(reportParams.reportId));
    dispatch(datasetActions.changeDatasetReportId(reportParams.reportId));
    dispatch(parameterActions.changeParameterReportId(reportParams.reportId));
    dispatch(spreadActions.changeSpreadReportId(reportParams.reportId));
  };

  /**
   * 보고서 저장 (새로운 보고서를 패치 합니다.)
   * @param {JSON} response 저장 후 REPORT_MSTR 테이블에 저장된 보고서 정보
   */
  const patchReport = (response) => {
    const report = generateReport(response.report);
    dispatch(reportActions.updateReport(report));
  };

  const removeReport = (dataSource, {deleteExcelFile}) => {
    const param = generateParameter(dataSource);
    const reports = selectReports(store.getState());

    models.Report.deleteReport(param).then((res) => {
      const data = res.data;
      const msg = data.msg;
      const result = data.result;

      const report = generateReport(data.report);
      const reportType = report.reports[0].options.reportType;
      const reportId = report.reports[0].reportId;

      if (res.status != 200) {
        alert(localizedString.failedDeleteReportMsg);
        return;
      }

      if (result) {
        alert(localizedString[msg]);
      }

      if (reports.length > 1) {
        dispatch(reportActions.deleteReport(report.reports[0]));
      } else {
        reload(reportType);
      }

      dispatch(itemActions.deleteItemForDesigner(reportId));
      dispatch(layoutActions.deleteLayoutForDesigner(
          {reportId: reportId, reportType: reportType}
      ));
      dispatch(datasetActions.deleteDatasetForDesigner(reportId));
      dispatch(parameterActions.deleteParameterForDesigner(reportId));
      dispatch(spreadActions.deleteSpread(reportId));
      reload(reportType);
      if (deleteExcelFile) {
        deleteExcelFile({
          reportId: dataSource.reportId,
          prevDesigner: designer
        });
      }
    });
  };

  const reload = (designerMode, adHocLayout, defaultItem) => {
    const param = {
      mode: designerMode,
      adhocLayout: AdHocLayoutTypes[adHocLayout],
      defaultItem: defaultItem || 'chart'
    };

    dispatch(reportActions.initReport(designerMode));
    dispatch(datasetActions.initDatasets());
    dispatch(itemActions.initItems(param));
    dispatch(layoutActions.initLayout(param));
    dispatch(parameterActions.initParameter());
    dispatch(spreadActions.initSpread());
    initWorkkbookJSONs();
  };

  // 보고서 불러오기 - 추후 뷰어 및 디자이너 분기 처리.
  const loadReport = (data) => {
    try {
      const editMode = selectEditMode(store.getState());
      const designerMode = selectCurrentDesignerMode(store.getState());
      // 공통 데이터 가공
      data.item.items.forEach((i) => {
        if (designerMode == DesignerMode['AD_HOC']) {
          i.mart = makeAdHocItemMart(i.type);
        } else {
          i.mart = makeMart(i);
        }
        ItemManager.generateMeta(i);
      });
      data.dataset.datasets.forEach((dataset) => {
        if (dataset.datasetType === DatasetType['DS_SQL']) {
          dataset.fields = makeFieldIcon(
              dataset.fields, dataset.datasetType);
        }
      });

      if (editMode == EditMode.VIEWER) {
        viewerLoadReport(data);
      } else {
        designerLoadReport(data);
      }
    } catch (error) {
      new Error('Report load Error');
    }
  };

  // 디자이너 보고서 불러오기
  const designerLoadReport = (data) => {
    try {
      const currentReportId = selectCurrentReportId(store.getState());
      const newReportId = data.reports[0].reportId;
      const reportId = {
        prevId: currentReportId,
        newId: newReportId
      };
      dispatch(reportActions.setReports(data.reports));
      dispatch(reportActions.selectReport(newReportId));
      dispatch(datasetActions.changeDataset({
        reportId: reportId,
        dataset: data.dataset
      }));
      dispatch(layoutActions.changeLayout({
        reportId: reportId,
        layout: data.layout
      }));
      dispatch(itemActions.changeItem({
        reportId: reportId,
        item: data.item
      }));
      dispatch(parameterActions.changeParameterInformation({
        reportId: reportId,
        informations: data.informations
      }));
      // spread 저장 데이터 구조 변경으로 인한 임시 코드 추후 제거 20240225
      if (data.spread !== undefined && !('bindingInfos' in data.spread)) {
        data.spread = {bindingInfos: data.spread};
      }
      dispatch(spreadActions.changeSpread({
        reportId: reportId,
        meta: data.spread
      }));
    } catch (error) {
      new Error('Report load Error');
    }
  };

  // 뷰어 보고서 불러오기
  const viewerLoadReport = (data) => {
    try {
      const reportId = data.reports[0].reportId;
      dispatch(reportActions.insertReport(data.reports[0]));
      dispatch(datasetActions.setDataset({
        reportId: reportId,
        dataset: data.dataset
      }));
      dispatch(layoutActions.setLayout({
        reportId: reportId,
        layout: data.layout
      }));
      dispatch(itemActions.setItem({
        reportId: reportId,
        item: data.item
      }));
      dispatch(parameterActions.setParameterInformation({
        reportId: reportId,
        informations: data.informations
      }));
      // spread 저장 데이터 구조 변경으로 인한 임시 코드 추후 제거 20240225
      if (data.spread !== undefined && !('bindingInfos' in data.spread)) {
        data.spread = {bindingInfos: data.spread};
      }
      dispatch(spreadActions.setSpread({
        reportId: reportId,
        meta: data.spread
      }));
    } catch (error) {
      new Error('Report load Error');
    }
  };

  const closeReport = (reportId) => {
    dispatch(reportActions.deleteReport({reportId}));
    dispatch(parameterActions.deleteReportParameter({reportId}));
    dispatch(itemActions.deleteReportItem({reportId}));
    dispatch(layoutActions.deleteReportLayout({reportId}));
    dispatch(datasetActions.deleteReportDataset({reportId}));
  };

  const querySearch = () => {
    let parameters = selectRootParameter(store.getState());
    const designerMode = selectCurrentDesignerMode(store.getState());
    const execute = () => {
      if (designerMode !== DesignerMode['EXCEL']) {
        executeItems();
      } else {
        executeSpread();
      }
    };

    if (parameters.informations.length <=
      parameters.filterSearchComplete.length) {
      execute();
    } else {
      let count = 0;
      const wait = setInterval(() => {
        count++;
        parameters = selectRootParameter(store.getState());

        if (parameters.informations.length <=
          parameters.filterSearchComplete.length) {
          execute();
          clearInterval(wait);
        }

        if (count >= 100) {
          clearInterval(wait);
        }
      }, 500);
    }
  };

  return {
    generateParameter,
    addReport,
    removeReport,
    patchReport,
    reload,
    loadReport,
    querySearch,
    closeReport
  };
};

export default useReportSave;
