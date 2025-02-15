import ItemType from './ItemType';
import {DataFieldType} from './dataFieldType';
import {dataFieldSortByItem} from './martUtilityFactory';

const utility = {};

for (const type of Object.values(ItemType)) {
  utility[type] = require(`../${type}/Utility.js`).default;
}

// 아이템 공통 Utility 메서드

/**
 * 아이템 객체에 meta 기본 데이터를 세팅합니다.
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const generateMeta = (item) => {
  utility[item.type].generateMeta(item);
};

/**
 * 아이템 객체를 기반으로 아이템 조회에 필요한 옵션 생성
 * @param {*} item 옵션을 삽입할 아이템 객체
 * @param {*} param 아이템 조회 파라미터
 * @param {*} rootItem rootItem
 */
const generateItem = (item, param, rootItem) => {
  utility[item.type].generateItem(item, param, rootItem);
};

/**
 * 아이템별 커스텀 파라미터 삽입
 * @param {JSON} item 아이템 객체
 * @param {JSON} param 파라미터 정보를 삽입할 객체
 */
const generateParameter = (item, param) => {
  utility[item.type].generateParameter(item, param);
};


const generateDataFieldOption = (item) => {
  const dataFieldOptions = {};
  const dataFieldOptionChild = utility[item.type].getDataFieldOptionChild();

  const makeDataFieldOptionChild = (type) =>
    ({[type]: dataFieldOptionChild[type]});

  Object.keys(dataFieldOptionChild).forEach((type) =>
    Object.assign(dataFieldOptions, makeDataFieldOptionChild(type)));

  if ([
    ItemType.TEXT_BOX,
    ItemType.SCHEDULER_COMPONENT
  ].includes(item.type)) return dataFieldOptions;
  // 정렬 기준 항목
  Object.assign(dataFieldOptions, {
    [DataFieldType.SORT_BY_ITEM]: dataFieldSortByItem
  });

  return dataFieldOptions;
};

/**
 * 비정형 아이템 파라미터 생성
 * @param {JSON} rootItem root Item state (비정형)
 * @param {JSON} param 파라미터 정보를 삽입할 객체
 */
const generateAdHocParameter = (rootItem, param) => {
  const dataField = rootItem.adHocOption.dataField;
  const adHocOption = rootItem.adHocOption;
  const pivotItem = rootItem.items[1];

  param.dimension = dataField.row.concat(dataField.column);
  param.measure = dataField.measure;

  param.removeNullData = pivotItem.meta.removeNullData;

  param.dimension = JSON.stringify(param.dimension);
  param.measure = JSON.stringify(param.measure);
  param.adHocOption = JSON.stringify(adHocOption);
};

/**
 * 리본 영역 아이템 배열을 반환합니다.
 * @param {ItemType} type 아이템 타입
 * @return {Array} ribbonItems
 */
const getRibbonItems = (type) => {
  return utility[type].getRibbonItems();
};

const commonPropsComparator = (prev, next) => {
  let result = true;

  if (next?.item?.mart != prev?.item?.mart) {
    result = false;
  } else if (!_.isEqual(prev?.item?.meta, next?.item?.meta)) {
    result = false;
  }
  return result;
};

const getAttributeItems = (type) => {
  return utility[type].getAttributeItems();
};

const getAdHocAttributeItems = () => {
  return ['AdHocOptions'];
};

const getTopBottomInfo = () => {
  return {
    dataFieldId: '',
    applyFieldId: '',
    topBottomType: 'TOP',
    topBottomCount: 0,
    isPercent: false,
    isShowOthers: false
  };
};

const getLayoutSetting = () => {
  const layoutType = {
    'chart': 'chart',
    'pivot': 'pivot',
    'chart_pivot': 'chart_pivot'
  };
  return layoutType;
};
/**
 * 탭 헤더 영역 아이템을 반환합니다.
 * @param {ItemType} type 아이템 타입
 * @return {Array} ribbonItems
 */
const getTabHeaderItems = (type) => {
  return utility[type].getTabHeaderItems();
};

// 아이템별 커스텀 메서드를 관리하기 위한 hook
const useCustomEvent = () => {
  const customEvent = {};

  // 각 아이템 customEvent Hook import
  for (const type of Object.values(ItemType)) {
    customEvent[type] = require('../' + type + '/CustomEvent.js').default();
  }

  /**
   * RibbonItem 렌더링에 필요한 JSON 객체를 리턴합니다.
   * @param {ItemType} type item type
   * @param {String} key ribbonItem id
   * @return {Array} ribbbonConfig
   */
  const getRibbonItemConfig = (type, key) => {
    return customEvent[type].ribbonConfig[key];
  };

  /**
   * RibbonItem 렌더링에 필요한 JSON 객체 배열을 리턴합니다.
   * @param {ItemType} type item type
   * @param {Array} ribbonItems ribbonItem id들이 담긴 배열
   * @return {Array} ribbbonConfigs
   */
  const getRibbonItemsConfig = (type, ribbonItems) => {
    return ribbonItems.map((item) => {
      return customEvent[type].ribbonConfig[item];
    });
  };

  /**
   * felxLayout Header 영역에 그려지는 버튼 집합을 리턴합니다.
   * @param {String} type
   * @param {String} key
   * @param {String} id itemId
   * @return {Array} tabButtons
   */
  const getTabHeaderButtons = (type, key, id) => {
    return customEvent[type].getTabHeaderButton(key, id);
  };

  return {
    getRibbonItemConfig,
    getRibbonItemsConfig,
    getTabHeaderButtons
  };
};

export default {
  generateMeta,
  generateItem,
  generateParameter,
  generateDataFieldOption,
  generateAdHocParameter,
  getRibbonItems,
  getAttributeItems,
  useCustomEvent,
  getAdHocAttributeItems,
  getTopBottomInfo,
  getTabHeaderItems,
  useCustomEvent,
  getLayoutSetting,
  commonPropsComparator
};
