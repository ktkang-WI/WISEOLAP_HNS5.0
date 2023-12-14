import {DataFieldType, DataFieldTypeOfItemType} from './dataFieldType';
import localizedString from 'config/localization';
import chartSeriesButtonIcon from 'assets/image/icon/button/series_type.png';
import dimensionIcon from 'assets/image/icon/dataSource/dimension.png';
import measureIcon from 'assets/image/icon/dataSource/measure.png';

// 기본값
const defaultDimension = {
  label: localizedString.dimension,
  icon: dimensionIcon,
  placeholder: localizedString.dimensionPlaceholder,
  type: 'DIMENSION'
};

const defaultMeasure = {
  label: localizedString.measure,
  icon: measureIcon,
  placeholder: localizedString.measurePlaceholder,
  type: 'MEASURE'
};

const defaultMart = {
  data: [],
  init: false
};

// dataField
const dataFieldMeasure = {
  ...defaultMeasure,
  useButton: true,
  // 우측에 버튼 추가가 필요한 경우 사용하는 옵션 ex)시리즈 옵션
  buttonIcon: chartSeriesButtonIcon,
  buttonEvent: function(e) {
    console.log(e);
  }
};

const dataFieldDimension = {
  ...defaultDimension
};

const dataFieldDimensionGroup = {
  ...defaultDimension,
  label: localizedString.dimensionGroup,
  placeholder: localizedString.dimensionGroupPlaceholder
};

const dataFieldColumn = {
  ...defaultDimension,
  label: localizedString.column,
  placeholder: localizedString.columnPlaceholder
};

const dataFieldRow = {
  ...defaultDimension,
  label: localizedString.row,
  placeholder: localizedString.rowPlaceholder
};

const dataFieldField = {
  ...defaultDimension,
  label: localizedString.field,
  placeholder: localizedString.fieldPlaceholder
};

const dataFieldSparkline = {
  ...defaultDimension,
  label: localizedString.sparkline,
  placeholder: localizedString.sparklinePlaceholder
};

const dataFieldSortByItem = {
  ...defaultMeasure,
  label: localizedString.sortByItem,
  placeholder: localizedString.newSortByItem
};

const dataFieldOptionChild = {
  [DataFieldType.MEASURE]: dataFieldMeasure,
  [DataFieldType.DIMENSION]: dataFieldDimension,
  [DataFieldType.DIMENSION_GROUP]: dataFieldDimensionGroup,
  [DataFieldType.COLUMN]: dataFieldColumn,
  [DataFieldType.ROW]: dataFieldRow,
  [DataFieldType.FIELD]: dataFieldField,
  [DataFieldType.SPARKLINE]: dataFieldSparkline,
  [DataFieldType.SORT_BY_ITEM]: dataFieldSortByItem
};

/**
 * 아이템의 type값을 가지고 아이템의 Mart 생성
 * @param {JSON} item 아이템 객체
 * @return {JSON} 생성된 아이템 Mart 객체
 */
const makeMart = (item) => {
  const dataFieldTypes = DataFieldTypeOfItemType[item.type];
  const dataFieldOptions = makeDataFieldOptions(dataFieldTypes);
  return {
    ...defaultMart,
    dataFieldOption: {
      ...dataFieldOptions
    },
    ribbonItem: []
  };
};

/**
 * 한 item 의 모든 dataFieldOption 생성
 * @param {string[]} dataFieldTypes dataFieldType 배열
 * @return {JSON} dataFieldOptions
 */
const makeDataFieldOptions = (dataFieldTypes) => {
  const dataFieldOptions = {};
  dataFieldTypes.forEach((type) =>
    Object.assign(dataFieldOptions, makeDataFieldOptionChild(type)));

  Object.assign(dataFieldOptions,
      makeDataFieldOptionChild(DataFieldType.SORT_BY_ITEM));

  return dataFieldOptions;
};

/**
 * dataFieldOption 하나 생성
 * @param {string} type dataFieldType
 * @return {JSON} dataFieldOption
 */
const makeDataFieldOptionChild = (type) =>
  ({[type]: dataFieldOptionChild[type]});

export {
  makeMart
};
