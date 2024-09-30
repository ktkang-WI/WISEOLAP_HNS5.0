import {selectRootDataset}
  from 'redux/selector/DatasetSelector';
import {selectRootItem} from 'redux/selector/ItemSelector';
import {selectCurrentReportId, selectReports, selectRootReport}
  from 'redux/selector/ReportSelector';
import store from 'redux/modules';
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
import {selectCurrentDesignerMode, selectEditMode, selectMyPageDesignerConfig}
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
    const rootDataset = selectRootDataset(store.getState());
    const datasets = rootDataset.datasets;
    const newDataFields = [];

    for (let i = 0; i < datasets.length; i ++) {
      if (datasets[i].datasetType !== 'CUBE') {
        newDataFields.push(datasets[i]);
        continue;
      }
      const newField = [];
      for (let j = 0; j < datasets[i].fields.length; j++) {
        if (datasets[i].fields[j].uniqueName.indexOf('].[') != -1) {
          newField.push(datasets[i].fields[j]);
        } else {
          if (datasets[i].fields[j].type === 'MEAGRP' ||
                datasets[i].fields[j].type === 'DIMGRP' ||
                datasets[i].fields[j].type === 'FLD') {
            newField.push(datasets[i].fields[j]);
            continue;
          }
          const type =
            datasets[i].fields[j].type === 'MEA'? 'MEAGRP' : 'DIMGRP';
          newField.push({...datasets[i].fields[j], type: type});
        }
      }
      newDataFields.push({...datasets[i], fields: newField});
    }

    const newRootDataset = {
      ...rootDataset,
      datasets: newDataFields
    };

    const param = {};
    const cubeQueries = {};
    param.reportId = dataSource.reportId;
    param.reportNm = dataSource.reportNm;
    param.fldId = dataSource.fldId;
    param.fldType = dataSource.fldType;
    param.fldName = dataSource.fldName;
    param.reportOrdinal = dataSource.reportOrdinal;
    param.reportType = reportType;
    param.reportTag = dataSource.reportTag;
    param.reportDesc = dataSource.reportDesc;
    param.requester = dataSource.requester || '';
    param.reportSubTitle = dataSource.reportSubTitle;
    // 홈앤쇼핑 초기 보고서 조회 여부 추가
    param.promptYn = dataSource.promptYn ? 'Y' : 'N';

    if (reportType === DesignerMode['EXCEL']) {
      param.reportXml = JSON.stringify(selectSpreadMeta(store.getState()));
    } else {
      param.reportXml = JSON.stringify({
        reportId: param.reportId,
        options: param
      });
    }

    const chartXml = selectRootItem(store.getState());
    const newChartXml = _.cloneDeep(chartXml);

    const getDatasetId = (item) => {
      let id = item.meta.dataField?.datasetId;
      if (reportType === DesignerMode['AD_HOC']) {
        id = chartXml.adHocOption.dataField?.datasetId;
      };
      return id;
    };

    newChartXml.items =
      newChartXml.items.map((item) => {
        // TODO: 현재 한 보고서 안에서 주제영역, 쿼리집적입력, 단일테이블 등 혼재되어 사용이 가능.
        // TODO 부분이 해결이 된다면 변경할 코드
        const datasetId = getDatasetId(item);
        const isCube = rootDataset.datasets.find((dataset) =>
          dataset.datasetId == datasetId && dataset.datasetType == 'CUBE'
        );
        if (isCube) {
          if (!cubeQueries[isCube.datasetId]) {
            cubeQueries[isCube.datasetId] = [];
          }
          cubeQueries[isCube.datasetId].push(item.type);
          cubeQueries[item.type] = item.mart.data.query;
        }

        return _.omit(item, 'mart');
      });

    param.datasetXml = JSON.stringify(newRootDataset);
    param.layoutXml = JSON.stringify(selectRootLayout(store.getState()));
    param.paramXml = JSON.stringify(
        selectCurrentInformationas(store.getState()));
    param.chartXml = JSON.stringify(newChartXml);
    // datasetQeury에 저장.(주제영역인 경우.)
    param.datasetQuery = JSON.stringify(cubeQueries);

    return param;
  };

  /**
   * 저장 후 새로운 ReportSlice 의 state 를 생성해줍니다.
   * ReportSlice state 초기값 (initialState)의 구조에 맞게 state를 생성해줍니다.
   * @param {JSON} data 저장 후 REPORT_MSTR 테이블에 저장된 보고서 정보
   * @return {JSON} report 새로 추가되거나 업데이트 할 ReportSlice 의 state
   */
  const generateReport = (data) => {
    // const report = _.cloneDeep(getReportInitialState());
    const rootReport = selectRootReport(store.getState());
    const report = _.cloneDeep(rootReport);

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
      options.requester = data.gridInfo;
      options.path = data.path;
      options.promptYn = data.promptYn;
      options.authPublish = '1';
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
    }).catch((e) => {
      console.log(e);
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
      const reportBos = data.reports[0].options.reportBos;
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
              dataset.fields, dataset.datasetNm);
        }
      });

      if (editMode == EditMode.VIEWER) {
        viewerLoadReport(data);
      } else {
        designerLoadReport(data);
      }

      if (reportBos.chkGb.length > 0) {
        const errDesc = reportBos.errDesc[reportBos.errDesc.length-1] ||
          '관리자에게 문의하세요.';
        // eslint-disable-next-line max-len
        alert(localizedString.checkDwReport + reportBos.chkGb + '\n' + errDesc);
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
        layout: {
          ...data.layout,
          selectedTab: 0
        }
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
        layout: {
          ...data.layout,
          selectedTab: 0
        }
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

  const querySearchException = (parameters, myPageConfigure, isAdhocCube) => {
    try {
      // 매개변수 필터링
      // eslint-disable-next-line max-len
      const paramInfos = parameters.informations.filter((param) => param.operation === 'BETWEEN');

      // 비정형 주제영역일 때만 BETWEEN 매개변수 반드시 필요
      if (isAdhocCube && (paramInfos.length === 0)) {
        // homenshopping 요청사항 문구
        // 기존: (보고서 조회를 위한 달력(BETWEEN) 매개변수가 반드시 필요합니다.\n 매개변수를 확인해주세요.)
        // eslint-disable-next-line max-len
        throw new Error('먼저 제공된 날짜 필터를 설정해 주세요.');
      }

      // 날짜 문자열을 Date 객체로 변환하는 함수
      const parseDate = (dateString, isStart) => {
        let year = 0;
        let month = isStart ? 0 : 11;
        // eslint-disable-next-line max-len
        let day = isStart ? 1 : new Date(dateString.slice(0, 4), month + 1, 0).getDate();

        if (dateString.includes('-')) {
          // YYYY-MM-DD 형식인 경우
          return new Date(dateString);
        }

        switch (dateString.length) {
          case 8: // YYYYMMDD 형식
            day = parseInt(dateString.slice(6, 8), 10);
          case 6: // YYYYMM 형식
            month = parseInt(dateString.slice(4, 6), 10) - 1;
          case 4: // YYYY 형식
            year = parseInt(dateString.slice(0, 4), 10);
            break;
          default:
            // eslint-disable-next-line max-len
            throw new Error('지원되지 않는 date format 입니다. \n date format 을 확인해 주세요.');
        }
        return new Date(year, month, day);
      };

      // 주어진 년도 (2년)의 최대 일수 계산
      const calculateDaysInYears = (startYear, numberOfYears) => {
        let days = 0;
        for (let i = 0; i < numberOfYears; i++) {
          const year = startYear + i;
          // eslint-disable-next-line max-len
          days += ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
        }
        return days;
      };

      // 각 매개변수에 대해 날짜 배열을 가져옴
      paramInfos.forEach((paramInfo) => {
        const dates = parameters.values[paramInfo.name].value;

        if (!Array.isArray(dates) || dates.length !== 2 ||
        !dates[0]?.trim() || !dates[1]?.trim()) {
          throw new Error(`날짜 배열 값이 유효하지 않습니다. 매개변수 이름: ${paramInfo.name}`);
        }

        const startDate = parseDate(dates[0], true);
        const endDate = parseDate(dates[1]);

        // startDate가 endDate보다 클 경우 예외 발생
        if (startDate > endDate) {
          throw new Error('시작 날짜가 종료 날짜보다 클 수 없습니다.');
        }

        // 두 날짜 간의 기간을 계산
        const diffTime = endDate - startDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))+1;

        // 주어진 년도 (2년)의 최대 일수 계산
        let period = 2;
        if (myPageConfigure.maxReportQueryPeriod.check) {
          period = myPageConfigure.maxReportQueryPeriod.period;
        }
        // eslint-disable-next-line max-len
        const maxDaysInTwoYears = calculateDaysInYears(startDate.getFullYear(), period);

        if (isAdhocCube && (diffDays > maxDaysInTwoYears)) {
          throw new Error('설정된 조회기간이 사용자 최대 조회 기간(' + period + '년)을 초과했습니다.');
        }
      });
    } catch (error) {
      alert('보고서를 조회 할 수 없습니다. \n 관리자에게 문의하세요.\n(' + error.message + ')');
      return true;
    }
  };

  const querySearch = () => {
    let parameters = selectRootParameter(store.getState());
    const designerMode = selectCurrentDesignerMode(store.getState());
    const myPageConfigure = selectMyPageDesignerConfig(store.getState());
    const rootDataset = selectRootDataset(store.getState());
    // 비정형 보고서 이고, 주제영역 데이터 집합만 있는지 여부
    // true: 비정형보고서 AND 주제영역 데이터 집합만 존재
    const isAdhocCube = process.env.NODE_ENV !== 'development' &&
    designerMode === DesignerMode['AD_HOC'] &&
    rootDataset.datasets.every((dataset) =>
      dataset.datasetType === DatasetType.CUBE);

    const execute = () => {
      if (designerMode !== DesignerMode['EXCEL']) {
        executeItems();
      } else {
        executeSpread();
      }
    };

    if (parameters.informations.length <=
      parameters.filterSearchComplete.length) {
      if (querySearchException(parameters, myPageConfigure, isAdhocCube)) {
        return;
      };
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
