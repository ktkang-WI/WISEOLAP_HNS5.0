import {setMeta} from '../util/metaUtilityFactory';
import {defaultDimension, defaultMeasure}
  from 'components/report/item/util/martUtilityFactory';
import chartSeriesButtonIcon from 'assets/image/icon/item/bar.png';
import localizedString from 'config/localization';
import {DataFieldType} from '../util/dataFieldType';


const seriesOption = localizedString.seriesOptions.data;


/**
 * 아이템 객체에 meta 기본 데이터를 세팅합니다.
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const generateMeta = (item) => {
  const defaultAxis = {
    formatType: 'Number',
    unit: 'Ones',
    axisStartToZero: true,
    useAxis: true,
    customText: false,
    suffixEnabled: false,
    suffix: {
      O: '',
      K: '천',
      M: '백만',
      B: '십억'
    },
    precision: 0,
    precisionType: 'roundUp',
    useDigitSeparator: true
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
  setMeta(item, 'seriesType', seriesOption.defaultType);
};

/**
 * 아이템 객체를 기반으로 아이템 조회에 필요한 옵션 생성
 * @param {*} item 옵션을 삽입할 아이템
 * @param {*} rootItem root item
 */
const generateItem = (item, rootItem) => {
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

  return {
    [DataFieldType.MEASURE]: dataFieldMeasure,
    [DataFieldType.DIMENSION]: dataFieldDimension,
    [DataFieldType.DIMENSION_GROUP]: dataFieldDimensionGroup
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
    'XAxisSetting',
    'YAxisSetting',
    'ExtraAxisSetting'
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
  getDataFieldOptionChild,
  getRibbonItems,
  getAttributeItems,
  getTabHeaderItems
};
