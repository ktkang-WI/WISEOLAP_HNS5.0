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
import LoadingSlice from 'redux/modules/LoadingSlice';
import {selectRootLayout} from 'redux/selector/LayoutSelector';
// import {useSelector} from 'react-redux';
// import {selectNewLinkParamInfo} from 'redux/selector/LinkSelector';

const useQueryExecute = () => {
  const {updateItem} = ItemSlice.actions;
  const {setSpreadData} = SpreadSlice.actions;
  const {alert} = useModal();
  const {setParameterValues, filterSearchComplete} = ParameterSlice.actions;
  const {startJob, endJob, endJobForce} = LoadingSlice.actions;
  // const dataFieldOption = useSelector(selectCurrentDataFieldOption);
  const dispatch = useDispatch();
  const newLinkParamInfo =
    JSON.parse(sessionStorage.getItem('newWindowLinkParamInfo'));
  // useSelector(selectNewLinkParamInfo);

  /**
   * 조회에 필요한 파라미터 생성
   * @param {JSON} item 조회할 아이템
   * @param {JSON} datasets 조회할 아이템이 속한 보고서의 datasets
   * @param {JSON} parameters 조회할 아이템이 속한 보고서의 parameters
   * @param {JSON} filter 아이템에 적용할 필터
   * @param {JSON} flag 쿼리보기로 사용 여부
   * @return {JSON} parameter
   */
  const generateParameter = async (
      item, datasets, parameters, filter={}, flag) => {
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

    if (flag) {
      param.flag = flag;
    }
    const hasData = item.mart.init ? 'ok' : 'no';
    param.hasData = hasData;

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
   * @param {JSON} flag 쿼리보기 여부
   * @return {JSON} parameter
   */
  const generateAdHocParamter = (rootItem, datasets, parameters, flag) => {
    const param = {};

    const report = selectCurrentReport(store.getState()) || {};

    param.reportId = report.reportId;
    param.reportType = report.options?.reportType;
    param.itemType = ItemType.CHART;
    param.dataset = {};
    if (flag) {
      param.flag = 'showQuery';
    }

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
    if (rootItem.items[1].meta.dataFiltering) {
      param.havingClauseInfo =
        JSON.stringify(rootItem.items[1].meta.dataFiltering);
    }
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
  const executeAdHocItem = async (rootItem, datasets, parameters, flag) => {
    try {
      validateRequiredField(rootItem);
      const cloneItem = _.cloneDeep(rootItem);
      const chartItem = cloneItem.items[0];
      const pivotItem = cloneItem.items[1];
      const param =
        generateAdHocParamter(cloneItem, datasets, parameters, flag);
      const reportId = selectCurrentReportId(store.getState());

      const layout = cloneItem?.adHocOption?.layoutSetting;

      const getAdhocItemData = async (item) => {
        param.itemType = item.type;
        await models.Item.getItemData(param).then((response) => {
          if (response.status != 200) {
            return;
          }
          const data = response.data;

          item.mart.init = true;
          if (data.info['type'] === 'showQuery') {
            item.mart.init = false;
          }
          item.mart.data = data;
          item.mart.toggle = ((item.mart.toggle || 0) + 1) % 10;

          if (nullDataCheck(item)) {
            alert(`${item?.meta?.name}${localizedString.noneData}`);
          }
          if (data.info['type'] !== 'showQuery') {
            ItemManager.generateItem(item, param, cloneItem);
          }
          dispatch(updateItem({reportId, item: item}));
        }).catch((e) => {
          console.log(e);
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
          try {
            const param = [chartItem, pivotItem];
            const promises = param.reduce((acc, item) => {
              acc.push(getAdhocItemData(item));

              return acc;
            }, []);

            await Promise.all(promises);
          } catch (e) {
            console.log(e);
          }
          break;
        case 'chart':
          await getAdhocItemData(chartItem);
          break;
        case 'pivot':
          await getAdhocItemData(pivotItem);
          break;
        default:
          try {
            const param = [chartItem, pivotItem];
            const promises = param.reduce((acc, item) => {
              acc.push(getAdhocItemData(item));

              return acc;
            }, []);

            await Promise.all(promises);
          } catch (e) {
            console.log(e);
          }
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
   * @param {JSON} flag 쿼리보기로 사용 여부
   */
  const executeItem = async (item, datasets, parameters, filter, flag) => {
    try {
      validateRequiredField(item);
      const tempItem = _.cloneDeep(item);
      const param =
          await generateParameter(tempItem, datasets, parameters, filter, flag);

      const reportId = selectCurrentReportId(store.getState());

      // TODO: 추후 PivotMatrix 옵션화
      if (false && item.type == ItemType.PIVOT_GRID) {
        tempItem.mart.init = true;
        ItemManager.generateItem(tempItem, param);

        dispatch(updateItem({reportId, item: tempItem}));
      } else {
        const response = await models.Item.getItemData(param);

        if (response.status != 200) {
          return;
        }
        const data = response.data;

        tempItem.mart.init = true;
        if (data.info['type'] === 'showQuery') {
          tempItem.mart.init = false;
        }
        tempItem.mart.data = data;
        tempItem.mart.currentFilter = filter || {};
        tempItem.mart.toggle = ((tempItem.mart.toggle || 0) + 1) % 10;

        if (data.info['type'] !== 'showQuery') {
          ItemManager.generateItem(tempItem, param);
        }

        dispatch(updateItem({reportId, item: tempItem}));

        return tempItem;
      }
    } catch (error) {
      console.error(error);
      if (error.message !== 'canceled') {
        alert(error.message);
      }
    }
  };

  const executeSpread = async (flag) => {
    let loadingMsg = '데이터를 조회 중입니다.';
    if (flag) loadingMsg = '쿼리를 조회 중입니다.';

    dispatch(startJob(loadingMsg));
    const state = store.getState();
    const datasets = selectCurrentDatasets(state);
    const currentReportId = selectCurrentReportId(state);
    const reportId = selectCurrentReportId(state);

    if (_.isEmpty(datasets)) {
      dispatch(endJob(loadingMsg));
      alert(localizedString.dataSourceNotSelectedMsg);
      return;
    }

    const parameters = selectRootParameter(state);
    const bindingInfos = selectBindingInfos(state);
    const datas = {};
    const promises = [];

    for (const dataset of datasets) {
      let isBinding = true;

      if (_.isEmpty(bindingInfos[dataset.datasetId]) ||
      !bindingInfos[dataset.datasetId].useBinding) {
        dispatch(endJob(loadingMsg));
        alert(localizedString.spreadBindingInfoNot + '\n' + dataset.datasetId);
        isBinding = false;
      }

      const dsId = dataset.dataSrcId;
      const query = dataset.datasetQuery;

      if (isBinding) {
        promises.push(new Promise((resolve, reject) => {
          models.DBInfo.getAllDatasetDatas(
              reportId, dsId, query, parameters, flag
          )
              .then((res) => {
                resolve({datasetId: dataset.datasetId, data: res.data});
              })
              .catch((e) => {
                reject(e);
              });
        }));
      }
    }

    if (promises.length === 0) return;

    await Promise.all(promises)
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
        }).finally(() => {
          dispatch(endJob(loadingMsg));
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

  const executeValidata = () => {
    const datasets = selectCurrentDatasets(store.getState());
    const rootItem = selectRootItem(store.getState());
    try {
      let msg = '';
      if (datasets.length === 0) {
        msg = localizedString.dataSourceNotSelectedMsg;
        alert(msg);
        return true;
      }
      validateRequiredField(rootItem);
    } catch (error) {
      console.error(error);
      if (error.message !== 'canceled') {
        alert(error.message);
      }
      return true;
    }
  };

  /**
   * 선택돼 있는 보고서 전체 아이템 쿼리 실행
   * @param {string} flag
   */
  const executeItems = async (flag) => {
    let loadingMsg = '데이터를 조회 중입니다.';
    if (flag) loadingMsg = '쿼리를 조회 중입니다.';
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

    dispatch(startJob(loadingMsg));
    try {
      if (designerMode === DesignerMode['DASHBOARD']) {
        const {layoutConfig, selectedTab} = selectRootLayout(store.getState());
        // 쿼리보기로 하는 경우 한 아이템만 조회.
        const promises = rootItem.items.reduce((acc, item) => {
          // 컨테이너 사용하는 보고서일 경우 현재 보고 있는 탭만 조회
          if (Array.isArray(layoutConfig)) {
            if (selectedTab !== item.tab &&
              !(selectedTab === 0 && !item.tab)) {
              return acc;
            }
          }

          acc.push(executeItem(item, datasets, parameters, {}, flag));
          return acc;
        }, []);

        await Promise.all(promises).then((items) => {
          nullDataAlert(items);
        });


        if (EditMode['DESIGNER'] == editMode) {
          dispatch(updateDesinerExecutionState(true));
        } else {
          dispatch(updateViewerExecutionState(true));
        }
      }

      if (designerMode === DesignerMode['AD_HOC']) {
        await Promise.resolve(
            executeAdHocItem(rootItem, datasets, parameters, flag)
        );
        if (EditMode['DESIGNER'] == editMode) {
          dispatch(updateDesinerExecutionState(true));
        } else {
          dispatch(updateViewerExecutionState(true));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(endJob(loadingMsg));
    }
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
          }).catch((e) => {
            console.log(e);
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

      // 필터 데이터 조회중 취소 된 경우 로딩장 강제 종료
      if (res.code === 'ERR_CANCELED') {
        dispatch(endJobForce());
      }

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
    const setDefaultValue = async (name, value) => {
      const params = new URLSearchParams(window.location.search);
      const paramValues = JSON.parse(params.get('param_values') || '{}');
      let _value = value;
      if (paramValues[name]) {
        _value = paramValues[name];
      }

      if (newLinkParamInfo !== null && newLinkParamInfo.length > 0) {
        const matchedParam =
          newLinkParamInfo.find(
              (param) => param.fkParam === name);
        if (matchedParam) {
          _value = matchedParam.value;
        }
      }

      const reg = /\[MD_CODE\]|\[WI_SESSION_ID\]/;

      if (reg.test(value[0]) || reg.test(value[1])) {
        const res = await models.Report.getUserInfo();
        const info = res?.data || {};
        _value = [];
        _value = value.map((v) => {
          if (v == '[MD_CODE]') return info.mdCode;
          if (v == '[WI_SESSION_ID]') return info.userId;

          return v.replaceAll('[MD_CODE]', '\'' + info.mdCode + '\'')
              .replaceAll('[WI_SESSION_ID]', '\'' + info.userId + '\'');
        });
      }

      dispatch(setParameterValues({
        reportId, values: {[name]: {
          value: _value
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
          executeListParameter(param, promises).then(async (data) => {
            const params = new URLSearchParams(window.location.search);
            const paramValues = JSON.parse(params.get('param_values') || '{}');

            if (paramValues[param.name]) {
              data.value = paramValues[param.name];
            }

            const reg = /\[MD_CODE\]|\[WI_SESSION_ID\]/;

            if (reg.test(data.value[0]) || reg.test(data.value[1])) {
              const res = await models.Report.getUserInfo();
              const info = res?.data || {};

              data.value = data.value.map((v) => {
                if (v == '[MD_CODE]') return info.mdCode;
                if (v == '[WI_SESSION_ID]') return info.userId;

                return v.replaceAll('[MD_CODE]', '\'' + info.mdCode + '\'')
                    .replaceAll('[WI_SESSION_ID]', '\'' + info.userId + '\'');
              });
            }

            if (data) {
              setValues(param.name, data);
            }
          }).catch((e) => {
            console.log(e);
          });
        } else {
          if (param.defaultValueUseSql && param.calendarDefaultType != 'NOW') {
            // defaultValue 쿼리일 경우 쿼리 실행
            executeParameterDefaultValueQuery(param).then((data) => {
              setValues(param.name, {value: data});
            }).catch((e) => {
              console.log(e);
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
        throw new Error(`${dataFieldOption[key].label}`+
         `${localizedString.requiredFieldNotExist}`);
      }
    });
  };

  const nullDataAlert = (items) => {
    // 조회 시 nullData alert 창 한번만 나오도록 수정
    const nullDataItems = items.reduce((acc, item) => {
      if (nullDataCheck(item)) {
        acc.push(item.meta.name);
      }
      return acc;
    }, []);

    if (nullDataItems.length > 0) {
      const itemNames = nullDataItems.join('", "');
      alert(`"${itemNames}" ${localizedString.noneData}`);
    }
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
    initializeParameters,
    executeValidata
  };
};

export default useQueryExecute;
