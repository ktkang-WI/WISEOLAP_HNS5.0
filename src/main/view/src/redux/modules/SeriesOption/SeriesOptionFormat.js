import _ from 'lodash';

const generalKeyName = {
  auxiliaryAxis: 'auxiliaryAxis',
  ignoreEmptyPoints: 'ignoreEmptyPoints',
  pointerMarker: 'pointerMarker',
  reverseView: 'reverseView'
};

const pointerMarkerName = {
  Notation: 'Notation',
  overlayMode: 'overlayMode',
  direction: 'direction'
};

const seriesOptionDefaultFormat = {
  fieldId: '',
  type: 'bar',
  general: {
    auxiliaryAxis: false,
    ignoreEmptyPoints: false,
    pointerMarker: false,
    reverseView: false
  },
  pointLabel: {
    Notation: '없음',
    overlayMode: '기본',
    direction: '기본'
  }
};

// Data
const generalData = {
  auxiliaryAxis: '보조 축의 구성',
  ignoreEmptyPoints: '빈 포인트 무시',
  pointerMarker: '포인트 마커 표시',
  reverseView: '역순으로 보기'
};

const pointLabelNotationData = {
  none: '없음',
  argument: '인수',
  measureName: '측정값 명',
  value: '값',
  argumentMeasureName: '인수 및 측정값 명',
  measureNameValue: '측정값 명 및 값',
  argumentMeasureNameValue: '인수,측정값 명 및 값'
};

const overlappingModeData = {
  default: '기본',
  hidden: '없음',
  overlappingLabelReLocate: '중복 레이블 위치 변경'
};

const pointLabelDirectionData = {
  default: '기본',
  left: '왼쪽으로 회전',
  right: '오른쪽으로 회전'
};
// Data

const seriesOptionGetDataFieldFormat = {
  fieldId: '',
  reportId: 0
};

const seriesOptionInitFormat = {
  reportId: 0,
  fieldId: ''
};

const seriesOptionUpdateFormat = {
  fieldId: '',
  reportId: 0,
  seriesOptions: seriesOptionDefaultFormat
};

const seriesOptionFetchFormat = {
  fieldId: '',
  reportId: 0,
  seriesOptions: seriesOptionDefaultFormat
};

const getSeriesOptionGeneralFormat = () => {
  return _.cloneDeep(seriesOptionDefaultFormat.general);
};
const getSeriesOptionPointLabelFormat = () => {
  return _.cloneDeep(seriesOptionDefaultFormat.pointLabel);
};
const getSeriesOptionDefaultFormat = () => {
  return _.cloneDeep(seriesOptionDefaultFormat);
};
const getSeriesOptionGetDataFieldFormat = () => {
  return _.cloneDeep(seriesOptionGetDataFieldFormat);
};
const getSeriesOptionInitFormat = () => {
  return _.cloneDeep(seriesOptionInitFormat);
};
const getSeriesOptionUpdateFormat = () => {
  return _.cloneDeep(seriesOptionUpdateFormat);
};
const getSeriesOptionFetchFormat = () => {
  return _.cloneDeep(seriesOptionFetchFormat);
};

// Export datas
export {
  pointLabelNotationData,
  pointLabelDirectionData,
  overlappingModeData,
  generalData,
  seriesOptionDefaultFormat
};

// Export Format
export {
  getSeriesOptionGetDataFieldFormat,
  getSeriesOptionInitFormat,
  getSeriesOptionUpdateFormat,
  getSeriesOptionFetchFormat,
  getSeriesOptionDefaultFormat,
  getSeriesOptionGeneralFormat,
  getSeriesOptionPointLabelFormat
};


// Export KeyName
export {
  generalKeyName,
  pointerMarkerName
};
