import {defaultDimension, defaultMeasure}
  from 'components/report/item/util/martUtilityFactory';
import {DataFieldType} from '../util/dataFieldType';
import {setMeta} from '../util/metaUtilityFactory';


/**
 * 아이템 객체에 meta 기본 데이터를 세팅합니다.
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const generateMeta = (item) => {
  setMeta(item, 'legend', {
    useLegend: true,
    position: 'outside',
    horizontalAlignment: 'right',
    verticalAlignment: 'top',
    itemTextPosition: 'right'
  });
};

/**
 * 아이템 객체를 기반으로 아이템 조회에 필요한 옵션 생성
 * @param {*} item 옵션을 삽입할 아이템 객체
 * @param {*} param 아이템 조회 파라미터
 * @param {*} rootItem rootItem
 */
const generateItem = (item, param, rootItem) => {
};

/**
 * 아이템 객체의 데이터 항목 옵션
 * @return {JSON} dataFieldOption
 */
const getDataFieldOptionChild = () => {
  const dataFieldX = {
    ...defaultMeasure,
    label: 'X',
    limit: 1
  };

  const dataFieldY = {
    ...defaultMeasure,
    label: 'Y',
    limit: 1
  };

  const dataFieldDimension = {
    ...defaultDimension
  };

  return {
    [DataFieldType.X]: dataFieldX,
    [DataFieldType.Y]: dataFieldY,
    [DataFieldType.DIMENSION]: dataFieldDimension
  };
};

/**
 * 조회시 사용하는 파라미터 생성
 * @param {JSON} item 아이템 객체
 * @param {JSON} param 파라미터 정보를 삽입할 객체
 */
const generateParameter = (item, param) => {
  const dataField = item.meta.dataField;
  param.dimension = dataField.dimension;
  param.measure = dataField.x.concat(dataField.y);

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
    'InputTxt'
  ];
};

/**
 * 속성 영역 아이템 배열을 반환합니다.
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
