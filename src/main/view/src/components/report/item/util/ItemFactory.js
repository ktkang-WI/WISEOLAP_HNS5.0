import {makeMart} from './martUtilityFactory';
import {DataFieldTypeOfItemType} from './dataFieldType';
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
        },
        highlight: []
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
 * item.meta.dataField 데이터 초기화
 * @param {JSON} item 아이템 객체
 */
const initDataFieldMeta = (item) => {
  const dataFieldTypes = DataFieldTypeOfItemType[item.type];
  dataFieldTypes.forEach((type) => item.meta.dataField[type] = []);
};

export {makeItem};
