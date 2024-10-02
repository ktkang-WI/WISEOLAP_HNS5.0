import {dateDimension, defaultMeasure}
  from 'components/report/item/util/martUtilityFactory';
import chartSeriesButtonIcon from 'assets/image/icon/button/add_chart.png';
import {DataFieldType} from '../util/dataFieldType';
import {setMeta} from '../util/metaUtilityFactory';

/**
 * 아이템 객체에 meta 기본 데이터를 세팅합니다.
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const calendarOption = {
  contentArray: {
    autoNumberSet: true,
    columnNumber: 5
  }
};
const generateMeta = (item) => {
  setMeta(item, 'calendarOption', calendarOption);
};

/**
 * 아이템 객체를 기반으로 아이템 조회에 필요한 옵션 생성
 * @param {*} item 옵션을 삽입할 아이템 객체
 * @param {*} param 아이템 조회 파라미터
 * @param {*} rootItem rootItem
 */
const generateItem = (item, param, rootItem) => {
  const dataField = item.meta.dataField || rootItem.adHocOption.dataField;
  const data = item.mart.data;
  const measures = dataField.measure;
  const meaLength = measures.length;
  item.mart.seriesLength = data.info.seriesMeasureNames.length / meaLength;
  item.mart.formats = measures.map((mea) => mea.format);
};

/**
 * 아이템 객체의 데이터 항목 옵션
 * @return {JSON} dataFieldOption
 */
const getDataFieldOptionChild = () => {
  const dataFieldMeasure = {
    ...defaultMeasure,
    useButton: false,
    buttonIcon: chartSeriesButtonIcon,
    limit: 1
  };

  const dataFieldDimension = {
    ...dateDimension,
    limit: 1
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
    'Rotate',
    'Palette',
    'ContentArray',
    'InputTxt'
  ];
};

/**
 * 속셩 영역 아이템 배열을 반환합니다.
 * @return {Array} attributeItems
 */
const getAttributeItems = () => {
  return [
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
