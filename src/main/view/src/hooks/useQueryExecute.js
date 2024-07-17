import {
  selectCurrentDatasets
} from 'redux/selector/DatasetSelector';
import {
  selectCurrentAdHocOption,
  selectCurrentItems,
  selectRootItem
} from 'redux/selector/ItemSelector';
import {selectCurrentReport, selectCurrentReportId}
  from 'redux/selector/ReportSelector';
import ItemSlice from 'redux/modules/ItemSlice';
import store from 'redux/modules';
import _ from 'lodash';
import {useDispatch} from 'react-redux';
import {selectRootParameter} from 'redux/selector/ParameterSelector';
import ParameterSlice from 'redux/modules/ParameterSlice';
import ParamUtils from 'components/dataset/utils/ParamUtils';
import models from 'models';
import ItemManager from 'components/report/item/util/ItemManager';
import {DesignerMode, EditMode} from 'components/config/configType';
import useModal from './useModal';
import localizedString from 'config/localization';
import {selectCurrentDesignerMode,
  selectEditMode} from 'redux/selector/ConfigSelector';
import {selectBindingInfos} from 'redux/selector/SpreadSelector';
import SpreadSlice from 'redux/modules/SpreadSlice';
import ItemType from 'components/report/item/util/ItemType';
import {nullDataCheck} from 'components/report/util/ReportUtility';
import ExecuteSlice from 'redux/modules/ExecuteSlice';


const useQueryExecute = () => {
  const {updateItem} = ItemSlice.actions;
  const {setSpreadData} = SpreadSlice.actions;
  const {alert} = useModal();
  const {setParameterValues, filterSearchComplete} = ParameterSlice.actions;
  // const dataFieldOption = useSelector(selectCurrentDataFieldOption);
  const dispatch = useDispatch();

  /**
   * 조회에 필요한 파라미터 생성
   * @param {JSON} item 조회할 아이템
   * @param {JSON} datasets 조회할 아이템이 속한 보고서의 datasets
   * @param {JSON} parameters 조회할 아이템이 속한 보고서의 parameters
   * @param {JSON} filter 아이템에 적용할 필터
   * @return {JSON} parameter
   */
  const generateParameter = async (item, datasets, parameters, filter={}) => {
    const param = {};
    if ([
      ItemType.TEXT_BOX,
      ItemType.SCHEDULER_COMPONENT
    ].includes(item.type)) return;
    const report = selectCurrentReport(store.getState()) || {};
    const adhocOption = selectCurrentAdHocOption(store.getState());

    const dataField = adhocOption?.dataField ||
      item?.meta?.dataField;
    param.reportId = report.reportId;
    param.reportType = report.options?.reportType;
    param.itemType = item.type;
    param.dataset = {};

    const orgDataset = datasets.find(
        (dataset) => dataField.datasetId == dataset.datasetId
    );

    switch (orgDataset.datasetType) {
      case 'CUBE':
        param.dataset.dsId = orgDataset.dsId;
        param.dataset.dsViewId = orgDataset.dsViewId;
        param.dataset.cubeId = orgDataset.cubeId;
        param.dataset.dsType = orgDataset.datasetType;
        param.dataset.query = orgDataset.datasetQuery;
        break;
      default:
        param.dataset.dsId = orgDataset.dataSrcId;
        param.dataset.dsType = orgDataset.datasetType;
        param.dataset.query = orgDataset.datasetQuery;
        break;
    }

    const parameter = ParamUtils.
        generateParameterForQueryExecute(parameters);

    param.filter = JSON.stringify(filter);

    // 주제영역 마스터 필터 있는 경우
    // TODO: 추후 관계 검사 필요
    if (orgDataset.datasetType == 'CUBE' && !_.isEmpty(filter)) {
      for (const uniqueName in filter) {
        if (filter[uniqueName]) {
          const cubeInfoParam = {
            cubeId: orgDataset.cubeId,
            uniqueName: uniqueName
          };

          const response = await models.Cube.getCubeInfo(cubeInfoParam);

          parameter.push(ParamUtils.filterToParameter(filter[uniqueName],
              response.data, orgDataset.dsId));
        }
      };

      param.filter = '{}';
    }

    param.parameter = JSON.stringify(parameter);
    param.dataset = JSON.stringify(param.dataset);
    param.temporaryMeasures =
      JSON.stringify(orgDataset?.customDatas?.measures) || '[]';
    param.sortByItem = JSON.stringify(dataField.sortByItem);
    ItemManager.generateParameter(item, param);

    return param;
  };

  /**
   * 비정형 조회에 필요한 파라미터 생성
   * @param {JSON} rootItem State(item) (itemState 최상단)
   * @param {JSON} datasets 조회할 비정형 보고서의 datasets
   * @param {JSON} parameters 조회할 비정형 보고서의 parameters
   * @return {JSON} parameter
   */
  const generateAdHocParamter = (rootItem, datasets, parameters) => {
    const param = {};

    const report = selectCurrentReport(store.getState()) || {};

    param.reportId = report.reportId;
    param.reportType = report.options?.reportType;
    param.itemType = ItemType.CHART;
    param.dataset = {};

    // dataset
    const orgDataset = datasets.find(
        (ds) => rootItem.adHocOption.dataField.datasetId ==
        ds.datasetId
    );

    switch (orgDataset.datasetType) {
      case 'CUBE':
        param.dataset.dsId = orgDataset.dsId;
        param.dataset.dsViewId = orgDataset.dsViewId;
        param.dataset.cubeId = orgDataset.cubeId;
        param.dataset.dsType = orgDataset.datasetType;
        param.dataset.query = orgDataset.datasetQuery;
        break;
      default:
        param.dataset.dsId = orgDataset.dataSrcId;
        param.dataset.dsType = orgDataset.datasetType;
        param.dataset.query = orgDataset.datasetQuery;
        break;
    }

    const parameter = ParamUtils.
        generateParameterForQueryExecute(parameters);

    param.parameter = JSON.stringify(parameter);
    param.dataset = JSON.stringify(param.dataset);
    param.temporaryMeasures =
      JSON.stringify(orgDataset?.customDatas?.measures) || '[]';
    param.sortByItem =
      JSON.stringify(rootItem.adHocOption.dataField.sortByItem);
    param.gridAttribute =
      JSON.stringify(rootItem?.adHocOption?.gridAttribute) || '{}';
    ItemManager.generateAdHocParameter(rootItem, param);
    return param;
  };

  /**
   * 매개변수로 전달받은 모든 비정형 보고서 아이템 조회
   * @param {JSON} rootItem State(item) (itemState 최상단)
   * @param {JSON} datasets 조회할 아이템이 속한 보고서의 datasets
   * @param {JSON} parameters 조회할 아이템이 속한 보고서의 parameters
   */
  // NOTE: 해당 함수는 비정형 데이터에서 차트 메이커에 접근하여 데이터를 가져온다.
  // NOTE: 유저 데이터 요청 -> 차트데이터 -> 피벗그리드 -> 데이터 요청 -> 피벗그리드
  const executeAdHocItem = (rootItem, datasets, parameters) => {
    try {
      validateRequiredField(rootItem);
      const cloneItem = _.cloneDeep(rootItem);
      const chartItem = cloneItem.items[0];
      const pivotItem = cloneItem.items[1];
      const param = generateAdHocParamter(cloneItem, datasets, parameters);
      const reportId = selectCurrentReportId(store.getState());

      const layout = cloneItem?.adHocOption?.layoutSetting;

      const getAdhocItemData = (item) => {
        param.itemType = item.type;
        models.Item.getItemData(param).then((response) => {
          if (response.status != 200) {
            return;
          }
          const data = response.data;

          item.mart.init = true;
          item.mart.data = data;

          if (nullDataCheck(item)) {
            alert(`${item?.meta?.name}${localizedString.noneData}`);
          }

          ItemManager.generateItem(item, param, cloneItem);
          dispatch(updateItem({reportId, item: item}));
        });
      };

      // TODO: 추후 PivotMatrix 옵션화시 pivotItem 분기처리
      // const getAdhocPivotItem = () => {
      //   pivotItem.mart.init = true;
      //   ItemManager.generateItem(pivotItem, param, cloneItem);
      //   dispatch(updateItem({reportId, item: pivotItem}));
      // };

      switch (layout) {
        case 'chart_pivot':
          getAdhocItemData(chartItem);
          getAdhocItemData(pivotItem);
          break;
        case 'chart':
          getAdhocItemData(chartItem);
          break;
        case 'pivot':
          getAdhocItemData(pivotItem);
          break;
        default:
          getAdhocItemData(chartItem);
          getAdhocItemData(pivotItem);
          break;
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  /**
   * 매개변수로 전달받은 item만 조회
   * @param {JSON} item 조회할 아이템
   * @param {JSON} datasets 조회할 아이템이 속한 보고서의 datasets
   * @param {JSON} parameters 조회할 아이템이 속한 보고서의 parameters
   * @param {JSON} filter 아이템에 적용할 필터
   */
  const executeItem = async (item, datasets, parameters, filter) => {
    try {
      validateRequiredField(item);
      const tempItem = _.cloneDeep(item);
      const param =
          await generateParameter(tempItem, datasets, parameters, filter);

      const reportId = selectCurrentReportId(store.getState());

      // TODO: 추후 PivotMatrix 옵션화
      if (false && item.type == ItemType.PIVOT_GRID) {
        tempItem.mart.init = true;
        ItemManager.generateItem(tempItem, param);

        dispatch(updateItem({reportId, item: tempItem}));
      } else {
        models.Item.getItemData(param).then((response) => {
          if (response.status != 200) {
            return;
          }
          const data = response.data;

          tempItem.mart.init = true;
          tempItem.mart.data = data;
          tempItem.mart.currentFilter = filter || {};

          if (nullDataCheck(tempItem)) {
            alert(`${item.meta.name}${localizedString.noneData}`);
          }

          ItemManager.generateItem(tempItem, param);

          dispatch(updateItem({reportId, item: tempItem}));
        });
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const executeSpread = async () => {
    const state = store.getState();
    const datasets = selectCurrentDatasets(state);
    const currentReportId = selectCurrentReportId(state);
    const reportId = selectCurrentReportId(state);

    if (_.isEmpty(datasets)) {
      alert(localizedString.dataSourceNotSelectedMsg);
      return;
    }

    const parameters = selectRootParameter(state);
    const bindingInfos = selectBindingInfos(state);
    const datas = {};

    const promises = datasets.map((dataset) => {
      if (_.isEmpty(bindingInfos[dataset.datasetId]) ||
      !bindingInfos[dataset.datasetId].useBinding) {
        alert(localizedString.spreadBindingInfoNot);
        return;
      }
      const dsId = dataset.dataSrcId;
      const query = dataset.datasetQuery;
      return new Promise((resolve, reject) => {
        models.DBInfo.getAllDatasetDatas(reportId, dsId, query, parameters)
            .then((res) => {
              resolve({datasetId: dataset.datasetId, data: res.data});
            })
            .catch((e) => {
              reject(e);
            });
      });
    });

    Promise.all(promises)
        .then((res) => {
          res.forEach((v) => {
            datas[v.datasetId] = v.data;
          });
          dispatch(setSpreadData({
            reportId: currentReportId,
            data: datas
          }));
        })
        .catch((res) => {
          console.log(res);
        });
  };

  /**
   * 마스터 필터를 적용합니다.
   * @param {*} targetItem 마스터 필터를 사용한 아이템
   * @param {*} filter 마스터 필터 적용 대상 데이터 목록
   */
  const filterItems = (targetItem, filter) => {
    const reportId = selectCurrentReportId(store.getState());
    const items = selectCurrentItems(store.getState());
    const datasets = selectCurrentDatasets(store.getState());
    const parameters = selectRootParameter(store.getState());
    const meta = targetItem.meta;

    items.forEach((item) => {
      if (!item.mart || !item.mart.init) return;

      if (targetItem.id != item.id) {
        if (meta.interactiveOption?.crossDataSource ||
            item.meta.dataField.datasetId == meta.dataField.datasetId) {
          if (JSON.stringify(item.mart.currentFilter) !=
              JSON.stringify(filter)) {
            // 마스터 필터 무시 켜져 있는 아이템의 경우 필터 정보만 저장
            const tempItem = {
              ...item,
              mart: {
                ...item.mart,
                filter: filter
              }
            };

            if (item.meta.interactiveOption?.ignoreMasterFilter) {
              dispatch(updateItem({reportId, item: tempItem}));
            } else {
              executeItem(tempItem, datasets, parameters, filter);
            }
          }
        }
      }
    });
  };

  /**
   * 단일 아이템에 마스터 필터를 겁니다.
   * @param {*} item
   * @param {*} filter
   */
  const filterItem = (item, filter) => {
    const datasets = selectCurrentDatasets(store.getState());
    const parameters = selectRootParameter(store.getState());

    if (item && item.mart?.init &&
      JSON.stringify(item.mart.currentFilter) != JSON.stringify(filter)) {
      executeItem(item, datasets, parameters, filter);
    } else {
      const reportId = selectCurrentReportId(store.getState());
      dispatch(updateItem({reportId, item: item}));
    }
  };

  /**
   * targetItem을 제외한 모든 아이템의 마스터 필터를 제거합니다.
   * @param {*} targetItem
   */
  const clearAllFilter = (targetItem) => {
    const reportId = selectCurrentReportId(store.getState());
    const items = selectCurrentItems(store.getState());
    const datasets = selectCurrentDatasets(store.getState());
    const parameters = selectRootParameter(store.getState());
    const filter = {};

    items.forEach((item) => {
      if (!item.mart || !item.mart.init) return;
      if (targetItem.id != item.id) {
        const tempItem = {
          ...item,
          mart: {
            ...item.mart,
            filter: filter
          }
        };

        // 현재 적용된 필터가 있는 경우 제거
        if (JSON.stringify(item.mart.currentFilter) != '{}') {
          // 마스터 필터 무시 켜져 있는 아이템의 경우 필터 정보만 저장
          executeItem(tempItem, datasets, parameters, filter);
        } else {
          // 현재 적용된 필터가 없는 경우 filter 값 업데이트
          dispatch(updateItem({reportId, item: tempItem}));
        }
      }
    });
  };

  /**
   * 선택돼 있는 보고서 전체 아이템 쿼리 실행
   */
  const executeItems = () => {
    const rootItem = selectRootItem(store.getState());
    const datasets = selectCurrentDatasets(store.getState());
    const parameters = selectRootParameter(store.getState());
    const designerMode = selectCurrentDesignerMode(store.getState());
    const editMode = selectEditMode(store.getState());
    const {
      updateDesinerExecutionState,
      updateViewerExecutionState
    } = ExecuteSlice.actions;

    if (datasets.length === 0) {
      let msg = localizedString.dataSourceNotSelectedMsg;

      if (editMode == 'viewer') {
        msg = localizedString.reportNotSelectedMsg;
      }

      alert(msg);
      return;
    };

    if (designerMode === DesignerMode['DASHBOARD']) {
      rootItem.items.map((item) => executeItem(item, datasets, parameters));
      if (EditMode['DESIGNER'] == editMode) {
        dispatch(updateDesinerExecutionState(true));
      } else {
        dispatch(updateViewerExecutionState(true));
      }
    }

    if (designerMode === DesignerMode['AD_HOC']) {
      executeAdHocItem(rootItem, datasets, parameters);
      if (EditMode['DESIGNER'] == editMode) {
        dispatch(updateDesinerExecutionState(true));
      } else {
        dispatch(updateViewerExecutionState(true));
      }
    }
    // items.forEach((item) => executeItem(item, datasets, parameters));
  };

  /**
   * 연계 필터가 있는 리스트 필터 조회
   * @param {JSON} param 필터 정보
   * @param {Array} linkageFilter 연계 필터 리스트
   * @return {Promise}
   */
  const executeLinkageFilter = async (param, linkageFilter) => {
    return await new Promise((resolve) => {
      const wait = setInterval(() => {
        const parameters = selectRootParameter(store.getState());
        const requiredFilterLength = linkageFilter.
            filter((filterName) => !parameters.values[filterName]).length;

        if (requiredFilterLength == 0) {
          setListValues(param, linkageFilter).then((data) => {
            resolve(data);
          });
          clearInterval(wait);
        }
      }, 500);

      setTimeout(() => {
        clearInterval(wait);
        resolve();
      }, 600000);
    });
  };

  const setListValues = async (param, linkageFilter) => {
    const parameters = selectRootParameter(store.getState());
    try {
      let linkageValues = null;
      if (linkageFilter) {
        linkageValues = [];
        linkageFilter.map((name) => {
          const info = parameters.informations.find((p) => p.name == name);

          linkageValues.push({
            name,
            operation: info.operation,
            exceptionValue: info.exceptionValue,
            value: parameters.values[name].value
          });
        });
      }

      const res = await models.Parameter.getListItems(param, linkageValues);
      const values = res.data;
      if (linkageFilter) {
        values.linkageFilter = linkageFilter;
      }

      return values;
    } catch (e) {
      console.error(e);

      return {
        listItems: [],
        value: ''
      };
    }
  };

  /**
   * List의 아이템과 defaultValue 조회
   * @param {JSON} param
   * @param {Object} promises filter param-list-items 통신 promises
   */
  const executeListParameter = async (param, promises) => {
    // QUERY일 경우 연계 필터인지 확인
    if (param.dataSourceType == 'QUERY') {
      const query = param.dataSource;
      const linkageFilter = ParamUtils.getParameterNamesInQuery(query);

      if (linkageFilter && linkageFilter.length > 0) {
        const linkageFilterPromises = linkageFilter.map((linkage) =>
          promises[linkage]);
        await Promise.all(linkageFilterPromises);
        return await executeLinkageFilter(param, linkageFilter);
      } else {
        return await setListValues(param);
      }
    } else {
      return await setListValues(param);
    }
  };

  const executeParameterDefaultValueQuery = async (param) => {
    const res = await models.Parameter.getDefaultValue(param);
    if (res.status !== 200) {
      throw new Error('get Default Query Error');
    }
    return res.data;
  };

  const executeParameters = async (parameters) => {
    const reportId = selectCurrentReportId(store.getState());

    const setDefaultValue = (name, value) => {
      dispatch(setParameterValues({
        reportId, values: {[name]: {
          value
        }}
      }));
      dispatch(filterSearchComplete({reportId, id: name}));
    };

    const setValues = (name, values) => {
      dispatch(setParameterValues({reportId, values: {[name]: values}}));
      dispatch(filterSearchComplete({reportId, id: name}));
    };

    // eslint-disable-next-line max-len
    initializeParameters(parameters || selectRootParameter(store.getState()), setDefaultValue, setValues);
  };

  // eslint-disable-next-line max-len
  const initializeParameters = async (parameters, setDefaultValue, setValues) => {
    const promises = {};
    parameters.informations.forEach(async (param) => {
      try {
        // 리스트 파라미터인지 확인
        if (param.paramType == 'LIST') {
          if (param.defaultValueUseSql) {
            promises[param.uniqueName] = ((async () => {
              executeParameterDefaultValueQuery(param);
            })());
          }
          executeListParameter(param, promises).then((data) => {
            if (data) {
              setValues(param.name, data);
            }
          });
        } else {
          if (param.defaultValueUseSql && param.calendarDefaultType != 'NOW') {
            // defaultValue 쿼리일 경우 쿼리 실행
            executeParameterDefaultValueQuery(param).then((data) => {
              setValues(param.name, {value: data});
            });
          } else if (param.calendarDefaultType == 'NOW') {
            // defaultValue calendarDefaultType 현재일 경우 계산
            const defaultValue = [];

            param.calendarPeriodBase.map((base, i) => {
              const value = param.calendarPeriodValue ?
                param.calendarPeriodValue[i] : 0;
              const date = ParamUtils.getCalendarNowDefaultValue(base, value);

              defaultValue.push(
                  ParamUtils.parseStringFromDate(date, param.calendarKeyFormat)
              );
            });

            setDefaultValue(param.name, defaultValue);
          } else {
            setDefaultValue(param.name, param.defaultValue);
          }
        }
      } catch (e) {
        console.error(e);
        filterSearchComplete({reportId, id: param.name});
      }
    });
    await Promise.all(Object.values(promises));
  };

  const validateRequiredField = (item) => {
    const reportType = item.type;
    let dataFieldOption;
    let dataField;
    const designerMode = selectCurrentDesignerMode(store.getState());
    if (designerMode === DesignerMode['DASHBOARD']) {
      dataFieldOption = item.mart.dataFieldOption;
      dataField = item.meta.dataField;
    } else if (designerMode === DesignerMode['AD_HOC']) {
      dataFieldOption = item.adHocOption.dataFieldOption;
      dataField = item.adHocOption.dataField;
    }
    if (ItemType.RANGE_BAR === reportType) {
      if (dataField.range1.length != dataField.range2.length) {
        throw new Error(localizedString.rangeBarlengthAlert);
      }
    }
    const dataFieldOptionKeys = Object.keys(dataFieldOption);
    dataFieldOptionKeys.forEach((key) => {
      const isRequired = dataFieldOption[key].required;
      const isEmpty = dataField[key].length === 0;
      if (isRequired && isEmpty) {
        throw new Error(`${dataFieldOption[key].label}
         ${localizedString.requiredFieldNotExist}`);
      }
    });
  };

  return {
    generateParameter,
    generateAdHocParamter,
    executeItem,
    executeItems,
    filterItem,
    filterItems,
    clearAllFilter,
    executeParameters,
    executeLinkageFilter,
    executeSpread,
    executeParameterDefaultValueQuery,
    initializeParameters
  };
};

export default useQueryExecute;
