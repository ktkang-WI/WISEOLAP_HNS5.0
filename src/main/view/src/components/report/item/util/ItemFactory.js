import {makeAdHocItemMart, makeDataFieldOptions, makeMart}
  from './martUtilityFactory';
import {DataFieldType, DataFieldTypeOfItemType} from './dataFieldType';
import ItemManager from './ItemManager';
import {initDataFieldMeta, makeAdHocItemMeta} from './metaUtilityFactory';
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
        interactiveOption: {
          mode: 'single', // 마스터 필터 모드 'signle' or 'multiple'
          enabled: false, // 마스터 필터 사용 여부
          ignoreMasterFilter: false, // 마스터 필터 무시
          // 교차 데이터 소스 필터링 (마스터 필터가 enable 돼 있는데 해당 옵션 true면
          // 데이터 집합 관계없이 마스터 필터 일괄 적용)
          crossDataSource: false,
          targetDimension: 'dimension' // 대상 차원
        },
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
    ItemManager.generateMeta(item);
  };

  return item;
};

/**
 * 비정형 아이템의 세팅
 * @param {*} orgItem 아이템 객체
 * @return {JSON} 생성된 비정형 아이템의 정보
 */
const makeAdHocItem = (orgItem) => {
  const meta = !orgItem.meta ? makeAdHocItemMeta(orgItem) : orgItem.meta;
  const mart = !orgItem.mart ? makeAdHocItemMart() : orgItem.mart;

  return {
    ...orgItem,
    meta: meta,
    mart: mart
  };
};

const makeAdHocOption = () => {
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

export {
  makeItem,
  makeAdHocItem,
  makeAdHocOption
};
