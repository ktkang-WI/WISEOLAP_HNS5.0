import localizedString from 'config/localization';
import dimensionIcon from 'assets/image/icon/dataSource/dimension.png';
import measureIcon from 'assets/image/icon/dataSource/measure.png';
import sortByItemIcon from 'assets/image/icon/dataSource/sort_by_item.png';
import ItemManager from './ItemManager';

// 기본값
export const defaultDimension = {
  label: localizedString.dimension,
  icon: dimensionIcon,
  placeholder: localizedString.dimensionPlaceholder,
  type: 'DIM'
};

export const defaultAnyField = {
  icon: dimensionIcon,
  label: localizedString.field,
  placeholder: localizedString.fieldPlaceholder,
  required: true,
  type: 'ANY'
};

export const defaultMeasure = {
  label: localizedString.measure,
  icon: measureIcon,
  placeholder: localizedString.measurePlaceholder,
  required: true,
  type: 'MEA'
};

export const treeMapMeasure = {
  label: localizedString.treeMapMeasure,
  icon: measureIcon,
  placeholder: localizedString.measurePlaceholder,
  required: true,
  type: 'MEA'
};

export const dataFieldSortByItem = {
  ...defaultMeasure,
  icon: sortByItemIcon,
  label: localizedString.sortByItem,
  placeholder: localizedString.newSortByItem,
  required: false
};

const defaultMart = {
  data: [],
  init: false
};

/**
 * 아이템의 type값을 가지고 아이템의 Mart 생성
 * @param {JSON} item 아이템 객체
 * @return {JSON} 생성된 아이템 Mart 객체
 */
const makeMart = (item) => {
  const dataFieldOptions =
  ItemManager.generateDataFieldOption(item);
  const ribbonItems = ItemManager.getRibbonItems(item.type);
  const attributeItems = ItemManager.getAttributeItems(item.type);
  return {
    ...defaultMart,
    dataFieldOption: {
      ...dataFieldOptions
    },
    filter: {},
    ribbonItems: ribbonItems,
    attributeItems: attributeItems
  };
};

const makeAdHocItemMart = (type) => {
  // 비정형 -> type : chart or pivot
  const ribbonItems = ItemManager.getRibbonItems(type);

  return {
    ...defaultMart,
    ribbonItems: ribbonItems
  };
};

export {
  makeMart,
  makeAdHocItemMart
};
