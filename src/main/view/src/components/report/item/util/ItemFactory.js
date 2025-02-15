import {makeAdHocItemMart, makeMart}
  from './martUtilityFactory';
import {DataFieldType, dataFieldTypeOfItemTypeFunc} from './dataFieldType';
import ItemManager from './ItemManager';
import {initDataFieldMeta, makeAdHocItemMeta} from './metaUtilityFactory';
import {paletteCollection}
  from 'components/common/atomic/Popover/organism/Palette';
import {defaultItemNames} from 'components/report/item/util/ItemMappers';


/**
 * 아이템의 meta값을 가지고 mart를 세팅
 * @param {*} orgItem 아이템 객체
 * @param {*} countMap 아이템 이름 카운트
 * @param {*} palette 아이템 색상
 * @return {JSON} 생성된 아이템 객체
 */
const makeItem = (orgItem, countMap, palette) => {
  let item = {};

  let initNum = 1;
  if (countMap) {
    initNum = countMap[orgItem.type];
  }
  const fixMasterFilter = [
    {
      name: 'listBox',
      mode: 'multiple'
    },
    {
      name: 'treeView',
      mode: 'multiple'
    },
    {
      name: 'comboBox',
      mode: 'single'
    }];
  const isFixMasterFilter =
    fixMasterFilter.map((d) => d.name).includes(orgItem.type);
  const seriesType = orgItem.chartType;
  delete orgItem.chartType;
  // meta 값 있는 경우 불러오기로 간주
  if (!orgItem.meta) {
    const selectedPalette = orgItem?.palette || palette;
    // 기본 값 세팅
    item = {
      ...orgItem,
      meta: {
        interactiveOption: {
          mode:
            fixMasterFilter.find((d) =>
              d.name == orgItem.type)?.mode || 'single',
          // 마스터 필터 모드 'signle' or 'multiple'
          enabled: isFixMasterFilter, // 마스터 필터 사용 여부
          ignoreMasterFilter: isFixMasterFilter, // 마스터 필터 무시
          // 교차 데이터 소스 필터링 (마스터 필터가 enable 돼 있는데 해당 옵션 true면
          // 데이터 집합 관계없이 마스터 필터 일괄 적용)
          crossDataSource: isFixMasterFilter,
          targetDimension: 'dimension' // 대상 차원
        },
        name: defaultItemNames[orgItem.type] + initNum,
        memo: '',
        paletteType: 'palette',
        palette: paletteCollection[selectedPalette || 0],
        colorEdit: [],
        useCaption: true,
        dataField: {
          dataFieldQuantity: 0
        },
        dataHighlight: [],
        dataFilter: []
      }
    };
    if (orgItem.type === 'chart') {
      item.meta.seriesType = seriesType;
    }

    // 불필요하게 추가된 state 제거.
    delete item.palette;
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
  const mart = !orgItem.mart ? makeAdHocItemMart(orgItem.type) : orgItem.mart;

  return {
    ...orgItem,
    meta: meta,
    mart: mart
  };
};

const makeAdHocOption = (layout) => {
  const dataFieldTypes = dataFieldTypeOfItemTypeFunc('pivot');
  const dataField = {};
  dataFieldTypes.forEach((type) => dataField[type] = []);
  dataField[DataFieldType.SORT_BY_ITEM] = [];
  dataField.dataFieldQuantity = 0;
  const attributeItems = ItemManager.getAdHocAttributeItems();
  const topBottomInfo = ItemManager.getTopBottomInfo();
  const dataFieldOption = ItemManager.generateDataFieldOption({type: 'pivot'});

  dataFieldOption.measure.useButton = true;

  return {
    dataFieldOption: dataFieldOption,
    dataField: dataField,
    attributeItems: attributeItems,
    topBottomInfo: topBottomInfo,
    layoutSetting: layout || 'chart_pivot'
  };
};

export {
  makeItem,
  makeAdHocItem,
  makeAdHocOption
};
