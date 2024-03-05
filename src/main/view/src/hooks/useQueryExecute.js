import {
  selectCurrentDatasets
} from 'redux/selector/DatasetSelector';
import {
  selectCurrentItems,
  selectRootItem
} from 'redux/selector/ItemSelector';
import {selectCurrentReportId}
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
import {DesignerMode} from 'components/config/configType';
import useModal from './useModal';
import localizedString from 'config/localization';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {selectBindingInfos} from 'redux/selector/SpreadSelector';
import SpreadSlice from 'redux/modules/SpreadSlice';


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

    // TODO: 로그인 추가 후 유저 아이디 수정
    param.userId = 'admin';
    param.itemType = item.type;
    param.dataset = {};

    const orgDataset = datasets.find(
        (dataset) => item.meta.dataField.datasetId == dataset.datasetId
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
            userId: 'admin', // 추후 userId 받아서
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
    param.sortByItem = JSON.stringify(item.meta.dataField.sortByItem);
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

    // TODO: 로그인 추가 후 유저 아이디 수정
    param.userId = 'admin';
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
    param.sortByItem =
    JSON.stringify(rootItem.adHocOption.dataField.sortByItem);
    ItemManager.generateAdHocParameter(rootItem, param);

    return param;
  };

  /**
   * 매개변수로 전달받은 모든 비정형 보고서 아이템 조회
   * @param {JSON} rootItem State(item) (itemState 최상단)
   * @param {JSON} datasets 조회할 아이템이 속한 보고서의 datasets
   * @param {JSON} parameters 조회할 아이템이 속한 보고서의 parameters
   */
  const executeAdHocItem = (rootItem, datasets, parameters) => {
    try {
      validateRequiredField(rootItem);
      const cloneItem = _.cloneDeep(rootItem);
      const chartItem = cloneItem.items[0];
      const pivotItem = cloneItem.items[1];
      const param = generateAdHocParamter(cloneItem, datasets, parameters);
      const reportId = selectCurrentReportId(store.getState());

      models.Item.getAdHocItemData(param).then((response) => {
        if (response.status != 200) {
          alert('보고서 조회에 실패했습니다. 관리자에게 문의하세요.');
          return;
        }

        if (response.data['chart']) {
          if (response.data['chart'].data.length == 0) {
            alert(`${localizedString.adhoc}${localizedString.noneData}`);
            return;
          }
          chartItem.mart.init = true;
          chartItem.mart.data = response.data['chart'];
          ItemManager.generateItem(chartItem, cloneItem);
          dispatch(updateItem({reportId, item: chartItem}));
        }
        if (response.data['pivot']) {
          if (response.data['pivot'].data.length == 0) {
            alert(`${localizedString.adhoc}${localizedString.noneData}`);
            return;
          }
          pivotItem.mart.init = true;
          pivotItem.mart.data = response.data['pivot'];
          ItemManager.generateItem(pivotItem, cloneItem);
          dispatch(updateItem({reportId, item: pivotItem}));
        }
      });
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

      // TODO: 추후 PivotMatrix 적용할 때 해제
      // if (item.type == ItemType.PIVOT_GRID) {
      //   tempItem.mart.init = true;
      //   ItemUtilityFactory[tempItem.type].generateItem(tempItem, param);

      //   dispatch(updateItem({reportId, item: tempItem}));
      // } else {

      models.Item.getItemData(param).then((response) => {
        if (response.status != 200) {
          return;
        }
        const data = response.data;
        if (data.data.length === 0) {
          alert(`${item.meta.name}${localizedString.noneData}`);
        }

        tempItem.mart.init = true;
        tempItem.mart.data = data;
        tempItem.mart.currentFilter = filter || {};

        ItemManager.generateItem(tempItem);

        dispatch(updateItem({reportId, item: tempItem}));
      });
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const executeSpread = async () => {
    const datasets = selectCurrentDatasets(store.getState());
    const currentReportId = selectCurrentReportId(store.getState());
    if (_.isEmpty(datasets)) {
      alert(localizedString.dataSourceNotSelectedMsg); return;
    }
    const parameters = selectRootParameter(store.getState());
    const bindingInfos = selectBindingInfos(store.getState());
    const promises = [];
    const datas = {};

    datasets.forEach((dataset) => {
      promises.push((async () => {
        if (
          _.isEmpty(bindingInfos[dataset.datasetId]) ||
          !bindingInfos[dataset.datasetId].useBinding
        ) {
          alert(localizedString.spreadBindingInfoNot); return;
        }
        const dsId = dataset.dataSrcId;
        const query = dataset.datasetQuery;
        const data =
          await models.DBInfo.getAllDatasetDatas(dsId, query, parameters);
        if (!data.data.rowData) return;
        datas[dataset.datasetId] = data.data.rowData;
      })());
    });
    await Promise.all(promises);
    dispatch(setSpreadData({
      reportId: currentReportId,
      data: datas
    }));
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

    if (datasets.length === 0) {
      alert(localizedString.dataSourceNotSelectedMsg);
      return;
    };

    if (designerMode === DesignerMode['DASHBOARD']) {
      rootItem.items.map((item) => executeItem(item, datasets, parameters));
    }

    if (designerMode === DesignerMode['AD_HOC']) {
      executeAdHocItem(rootItem, datasets, parameters);
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
   */
  const executeListParameter = async (param) => {
    // QUERY일 경우 연계 필터인지 확인
    if (param.dataSourceType == 'QUERY') {
      const query = param.dataSource;
      const linkageFilter = ParamUtils.getParameterNamesInQuery(query);

      if (linkageFilter && linkageFilter.length > 0) {
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
    return res.data;
  };

  const executeParameters = () => {
    const parameters = selectRootParameter(store.getState());
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

    parameters.informations.map((param) => {
      try {
        // 리스트 파라미터인지 확인
        if (param.paramType == 'LIST') {
          executeListParameter(param).then((data) => {
            if (data) {
              setValues(param.name, data);
            }
          });
        } else {
          if (param.defaultValueUseSql && param.calendarDefaultType != 'NOW') {
            // defaultValue 쿼리일 경우 쿼리 실행
            executeParameterDefaultValueQuery(param).then((data) => {
              setValues(param.name, data);
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
  };

  const validateRequiredField = (item) => {
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
    executeItem,
    executeItems,
    filterItem,
    filterItems,
    clearAllFilter,
    executeParameters,
    executeLinkageFilter,
    executeSpread
  };
};

export default useQueryExecute;
