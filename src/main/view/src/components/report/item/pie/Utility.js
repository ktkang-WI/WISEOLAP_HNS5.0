import {setMeta} from '../util/metaUtilityFactory';
import {defaultDimension, defaultMeasure}
  from 'components/report/item/util/martUtilityFactory';
import localizedString from 'config/localization';
import {DataFieldType} from '../util/dataFieldType';

/**
 * 아이템 객체에 meta 기본 데이터를 세팅합니다.
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const generateMeta = (item) => {
  setMeta(item, 'pieChartStyle', 'pie');
  setMeta(item, 'labelPosition', 'columns');
  setMeta(item, 'tooltip', {
    billions: 'B',
    customPrefix: false,
    customSuffix: false,
    precsionOption: 'round',
    inputPrefix: '',
    format: 'value',
    millions: 'M',
    thousands: 'K',
    unit: 'Ones',
    precsion: 0,
    ones: ''
  });
  setMeta(item, 'labelEdit', {
    showTitle: true,
    billions: 'B',
    customPrefix: false,
    customSuffix: false,
    precsionOption: 'round',
    inputPrefix: '',
    format: 'value',
    millions: 'M',
    thousands: 'K',
    unit: 'Ones',
    precsion: 0,
    ones: ''
  });
};

const generateItem = () => {

};

/**
 * 아이템 객체의 데이터 항목 옵션
 * @return {JSON} dataFieldOption
 */
const getDataFieldOptionChild = () => {
  const dataFieldMeasure = {
    ...defaultMeasure
  };

  const dataFieldDimension = {
    ...defaultDimension
  };

  const dataFieldDimensionGroup = {
    ...defaultDimension,
    label: localizedString.dimensionGroup,
    placeholder: localizedString.dimensionGroupPlaceholder
  };

  return {
    [DataFieldType.MEASURE]: dataFieldMeasure,
    [DataFieldType.DIMENSION]: dataFieldDimension,
    [DataFieldType.DIMENSION_GROUP]: dataFieldDimensionGroup
  };
};

const generateParameter = (item, param) => {
  const dataField = item.meta.dataField;
  param.dimension = dataField.dimension.concat(dataField.dimensionGroup);
  param.measure = dataField.measure;

  param.dimension = JSON.stringify(param.dimension);
  param.measure = JSON.stringify(param.measure);
};

/**
 * 리본 영역 아이템 배열을 반환합니다.
 * @return {Array} ribbonItems
 */
const getRibbonItems = () => {
  return [
    'CaptionView',
    'NameEdit',
    'DataLabelEdit',
    'LabelPosition',
    'Tooltip',
    'ShowColorLegend',
    'PieChartStyle',
    'Palette',
    'ColorEdit',
    'PointLabel',
    'InputTxt'
  ];
};

/**
 * 속셩 영역 아이템 배열을 반환합니다.
 * @return {Array} attributeItems
 */
const getAttributeItems = () => {
  return [
    'InteractionNoDrillDown',
    'InteractionConfiguration',
    'TargetDimension'
  ];
};

const getTabHeaderItems = () => {
  return [];
};

export default {
  generateMeta,
  generateItem,
  getDataFieldOptionChild,
  generateParameter,
  getRibbonItems,
  getAttributeItems,
  getTabHeaderItems
};
