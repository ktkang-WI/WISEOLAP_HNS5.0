import {DataFieldType} from './dataFieldType';
import localizedString from 'config/localization';
import chartSeriesButtonIcon from 'assets/image/icon/item/chart_bar.png';
import dimensionIcon from 'assets/image/icon/dataSource/dimension.png';
import measureIcon from 'assets/image/icon/dataSource/measure.png';

// 기본값
const defaultDimension = {
  label: localizedString.dimension,
  icon: dimensionIcon,
  placeholder: localizedString.dimensionPlaceholder,
  type: 'DIM'
};

const defaultMeasure = {
  label: localizedString.measure,
  icon: measureIcon,
  placeholder: localizedString.measurePlaceholder,
  type: 'MEA'
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

const dataFieldOptionChild = {
  [DataFieldType.MEASURE]: dataFieldMeasure,
  [DataFieldType.DIMENSION]: dataFieldDimension,
  [DataFieldType.DIMENSION_GROUP]: dataFieldDimensionGroup,
  [DataFieldType.COLUMN]: dataFieldColumn,
  [DataFieldType.ROW]: dataFieldRow,
  [DataFieldType.FIELD]: dataFieldField,
  [DataFieldType.SPARKLINE]: dataFieldSparkline
};

const makeMart = (dataFieldTypes) => {
  const dataFieldOptions = makeDataFieldOptions(dataFieldTypes);
  return {
    ...defaultMart,
    dataFieldOption: {
      ...dataFieldOptions
    },
    ribbonItem: []
  };
};

const makeDataFieldOptions = (dataFieldTypes) => {
  const dataFieldOptions = {};
  dataFieldTypes.forEach((type) =>
    Object.assign(dataFieldOptions, makeDataFieldOptionChild(type)));

  return dataFieldOptions;
};

const makeDataFieldOptionChild = (type) =>
  ({[type]: dataFieldOptionChild[type]});

export {
  makeMart
};
