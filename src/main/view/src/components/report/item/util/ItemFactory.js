import {makeAdhocItemMart, makeDataFieldOptions, makeMart}
  from './martUtilityFactory';
import {DataFieldType, DataFieldTypeOfItemType} from './dataFieldType';
/**
 * 아이템의 meta값을 가지고 mart를 세팅
 * @param {*} orgItem 아이템 객체
 * @return {JSON} 생성된 아이템 객체
 */
const makeItem = (orgItem) => {
  let item = {};
  // meta 값 있는 경우 불러오기로 간주
  if (!orgItem.meta) {
    // 기본 값 세팅
    item = {
      ...orgItem,
      meta: {
        name: '아이템',
        memo: '',
        useCaption: true,
        dataField: {
          dataFieldQuantity: 0
        }
      }
    };
  }

  // mart 및 meta 값 세팅
  const mart = makeMart(item);
  item.mart = mart;

  if (!orgItem.meta) {
    initDataFieldMeta(item);
  };

  return item;
};

/**
 * 비정형 아이템의 meta값 세팅
 * @return {JSON} 생성된 비정형 아이템의 meta 정보
 */
const makeAdhocItemMeta = () => {
  return {
    name: '아이템',
    memo: '',
    useCaption: true
  };
};

/**
 * 비정형 아이템의 세팅
 * @param {*} orgItem 아이템 객체
 * @return {JSON} 생성된 비정형 아이템의 정보
 */
const makeAdhocItem = (orgItem) => {
  const meta = !orgItem.meta ? makeAdhocItemMeta() : orgItem.meta;
  const mart = !orgItem.mart ? makeAdhocItemMart() : orgItem.mart;

  return {
    ...orgItem,
    meta: meta,
    mart: mart
  };
};

const makeAdhocOption = () => {
  const dataFieldTypes = DataFieldTypeOfItemType['pivot'];
  const dataField = {};
  dataFieldTypes.forEach((type) => dataField[type] = []);
  dataField[DataFieldType.SORT_BY_ITEM] = [];
  dataField.dataFieldQuantity = 0;

  return {
    dataFieldOption: makeDataFieldOptions(dataFieldTypes),
    dataField: dataField
  };
};

/**
 * item.meta.dataField 데이터 초기화
 * @param {JSON} item 아이템 객체
 */
const initDataFieldMeta = (item) => {
  const dataFieldTypes = DataFieldTypeOfItemType[item.type];
  dataFieldTypes.forEach((type) => item.meta.dataField[type] = []);
  item.meta.dataField[DataFieldType.SORT_BY_ITEM] = [];
};

export {
  makeItem,
  makeAdhocItem,
  makeAdhocOption
};
