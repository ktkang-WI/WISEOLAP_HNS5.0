import {defaultDimension, defaultMeasure}
  from 'components/report/item/util/martUtilityFactory';
import {DataFieldType} from '../util/dataFieldType';
import localizedString from 'config/localization';
import {setMeta} from '../util/metaUtilityFactory';


/**
 * 아이템 객체에 meta 기본 데이터를 세팅합니다.
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const generateMeta = (item) => {
  const defaultAxis = {
    formatType: 'Number',
    unit: 'Ones',
    axisStartToZero: false,
    useAxis: true,
    customText: false,
    suffixEnabled: false,
    suffix: {
      O: '',
      K: '천',
      M: '백만',
      B: '십억'
    },
    suffixO: '',
    suffixK: localizedString.k,
    suffixM: localizedString.m,
    suffixB: localizedString.b,
    precision: 0,
    precisionType: 'round',
    useDigitSeparator: true
  };
  setMeta(item, 'legend', {
    useLegend: true,
    position: 'outside',
    horizontalAlignment: 'right',
    verticalAlignment: 'top',
    itemTextPosition: 'right'
  });
  setMeta(item, 'yAxis', defaultAxis);
};

/**
 * 아이템 객체를 기반으로 아이템 조회에 필요한 옵션 생성
 * @param {*} item 옵션을 삽입할 아이템
 * @param {*} rootItem root item
 */
const generateItem = (item, rootItem) => {
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

  return {
    [DataFieldType.MEASURE]: dataFieldMeasure,
    [DataFieldType.DIMENSION]: dataFieldDimension
  };
};

/**
 * 차트 커스텀 파라미터 삽입
 * @param {JSON} item 아이템 객체
 * @param {JSON} param 파라미터 정보를 삽입할 객체
 */
const generateParameter = (item, param) => {
  const dataField = item.meta.dataField;
  param.dimension = dataField.dimension;
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
    'YAxisSetting',
    'ShowColorLegendD3',
    'Palette',
    'ColorEdit',
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
    'InteractionConfiguration'
  ];
};

const getTabHeaderItems = () => {
  return [];
};

export default {
  generateMeta,
  generateItem,
  generateParameter,
  getDataFieldOptionChild,
  getRibbonItems,
  getAttributeItems,
  getTabHeaderItems
};
