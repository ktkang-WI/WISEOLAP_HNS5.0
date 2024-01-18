import {setMeta} from '../util/metaUtilityFactory';

/**
 * 아이템 객체에 meta 기본 데이터를 세팅합니다.
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const generateMeta = (item) => {
  const defaultAxis = {
    format: 'Number',
    unit: 'Ones',
    useShowZero: true,
    useYxAxis: true,
    customText: false,
    customSuffix: false,
    ones: '',
    thousands: '천',
    millions: '백만',
    billions: '십억',
    decimalPoint: 0,
    round: 'roundUp',
    useComma: true
  };

  setMeta(item, 'xAxis', {
    useXAxis: true,
    xAxisCaption: undefined,
    xAxisInclination: 0
  });
  setMeta(item, 'yAxis', defaultAxis);
  setMeta(item, 'supplyAxis', defaultAxis);

  setMeta(item, 'legend', {
    useLegend: true,
    legendPosition: ''
  });

  setMeta(item, 'useRotate', false);
  // seriesType의 경우 여기서 기본값을 설정하지 않고
  // NormalChartDefaultElement.js에서 chartType으로 넘긴다.
};

/**
 * 아이템 객체를 기반으로 아이템 조회에 필요한 옵션 생성
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const generateItem = (item) => {

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
    'XAxisSetting',
    'YAxisSetting',
    'ExtraAxisSetting',
    'SeriesType'
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
  generateParameter,
  getRibbonItems,
  getAttributeItems,
  getTabHeaderItems
};
