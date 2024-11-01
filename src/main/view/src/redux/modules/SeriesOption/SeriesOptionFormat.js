import _ from 'lodash';
import localizedString from '../../../config/localization';

const seriesOption = localizedString.seriesOptions.data;

// name
const generalKeyName = {
  auxiliaryAxis: 'auxiliaryAxis',
  ignoreEmptyPoints: 'ignoreEmptyPoints',
  pointerMarker: 'pointerMarker',
  reverseView: 'reverseView'
};

const pointerMarkerKeyName = {
  Notation: 'Notation',
  overlayMode: 'overlayMode',
  direction: 'direction'
};

// Data
const generalData = {
  auxiliaryAxis: seriesOption.general.auxiliaryAxis,
  ignoreEmptyPoints: seriesOption.general.ignoreEmptyPoints,
  pointerMarker: seriesOption.general.pointerMarker,
  reverseView: seriesOption.general.reverseView
};

const pointLabelNotationData = {
  none: seriesOption.pointLabelNotation.none,
  argument: seriesOption.pointLabelNotation.argument,
  measureName: seriesOption.pointLabelNotation.measureName,
  value: seriesOption.pointLabelNotation.value,
  argumentMeasureName: seriesOption.pointLabelNotation.argumentMeasureName,
  measureNameValue: seriesOption.pointLabelNotation.measureNameValue,
  argumentMeasureNameValue: seriesOption.pointLabelNotation.argMeaNameValue,
  topNvalue: 'Top N 값'
};

const overlappingModeData = {
  default: seriesOption.overlappingMode.default,
  hidden: seriesOption.overlappingMode.hidden,
  overlappingLabelReLocate:
    seriesOption.overlappingMode.overlappingLabelReLocate
};

const pointLabelDirectionData = {
  default: seriesOption.pointLabelDirectionData.default,
  left: seriesOption.pointLabelDirectionData.left,
  right: seriesOption.pointLabelDirectionData.right
};
// Data

// Format
const seriesOptionDefaultFormat = {
  fieldId: '',
  type: seriesOption.defaultType,
  general: {
    auxiliaryAxis: false,
    ignoreEmptyPoints: false,
    pointerMarker: true,
    reverseView: false
  },
  pointLabel: {
    Notation: seriesOption.pointLabelNotation.value,
    overlayMode: seriesOption.overlappingMode.default,
    direction: seriesOption.pointLabelDirectionData.default
  }
};

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

const measuresValueUpdateFormat = {
  customDatas: null,
  reportId: 0
};

// get Format
const getMeasuresValueUpdateFormat = () => {
  return _.cloneDeep(measuresValueUpdateFormat);
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
  getSeriesOptionPointLabelFormat,
  getMeasuresValueUpdateFormat
};


// Export KeyName
export {
  generalKeyName,
  pointerMarkerKeyName
};
