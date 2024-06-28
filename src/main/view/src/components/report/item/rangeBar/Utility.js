import {defaultDimension, defaultMeasure}
  from 'components/report/item/util/martUtilityFactory';
import {DataFieldType} from '../util/dataFieldType';
import {setMeta} from '../util/metaUtilityFactory';
import chartSeriesButtonIcon from 'assets/image/icon/item/bar.png';
import localizedString from 'config/localization';
import {selectSeriesOption}
  from 'redux/selector/SeriesOption/SeriesOptionSelector';
import store from 'redux/modules';
import {chartImages} from '../util/chartImageImporter';

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
    suffixO: '',
    suffixK: localizedString.k,
    suffixM: localizedString.m,
    suffixB: localizedString.b,
    precision: 0,
    precisionType: 'round',
    useDigitSeparator: true
  };

  setMeta(item, 'xAxis', {
    xAxisMark: true,
    axisCutomText: '',
    xAxisInclination: 0
  });
  setMeta(item, 'yAxis', defaultAxis);
  setMeta(item, 'extraAxis', defaultAxis);

  setMeta(item, 'legend', {
    useLegend: true,
    position: 'outside',
    horizontalAlignment: 'right',
    verticalAlignment: 'top',
    itemTextPosition: 'right'
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
  const dataField = item.meta.dataField;
  const data = item.mart.data;
  const range1 = dataField.range1;
  item.mart.range1Length = Object.keys(data.info.range).length / range1.length;
  item.mart.formats = range1.map((range) => range.format);
};

/**
 * 아이템 객체의 데이터 항목 옵션
 * @return {JSON} dataFieldOption
 */
const getDataFieldOptionChild = () => {
  const newDataFieldMeasure = {
    ...defaultMeasure,
    useButton: true,
    // 우측에 버튼 추가가 필요한 경우 사용하는 옵션 ex)시리즈 옵션
    buttonIcon: (column) => {
      const seriesOptions = selectSeriesOption(store.getState()) || [];

      const seriesOption = seriesOptions.find(
          (opt) => column?.fieldId == opt?.fieldId);

      if (seriesOption) {
        return chartImages[seriesOption.type] || chartSeriesButtonIcon;
      }

      return chartSeriesButtonIcon;
    },
    buttonEvent: function(e) {
      console.log(e);
    }
  };

  const dataFieldRangeStart = {
    ...newDataFieldMeasure,
    label: `${localizedString.range}1`
  };

  const dataFieldRangeEnd = {
    ...newDataFieldMeasure,
    label: `${localizedString.range}2`
  };

  dataFieldRangeEnd.useButton = false;

  const dataFieldDimension = {
    ...defaultDimension
  };

  return {
    [DataFieldType.RANGE1]: dataFieldRangeStart,
    [DataFieldType.RANGE2]: dataFieldRangeEnd,
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
  param.dimension = dataField.dimension.concat(dataField.dimensionGroup);
  param.measure = dataField.range1.concat(dataField.range2);

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
    'ColorEdit',
    'XAxisSetting',
    'YAxisSetting',
    'ExtraAxisSetting',
    'ShowColorLegend',
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
