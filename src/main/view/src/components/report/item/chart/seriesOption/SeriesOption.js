import {
  overlappingModeData,
  pointLabelDirectionData,
  pointLabelNotationData}
  from 'redux/modules/SeriesOption/SeriesOptionFormat';

const isUsedAuxiliaryAxis = (seriesOptions) => {
  if (!seriesOptions) false;
  const auxiliaryAxis =
    seriesOptions.filter((item) => item.general.auxiliaryAxis === true);
  if (auxiliaryAxis.length === 0) return false;
  return true;
};

export const labelFormat = (Notation, valueObject) => {
  let format = '';
  if (pointLabelNotationData.argument === Notation) {
    format = `${valueObject.argument}`;
  } else if (pointLabelNotationData.measureName === Notation) {
    format = `${valueObject.seriesName}`;
  } else if (pointLabelNotationData.value === Notation) {
    format = `${valueObject.value}`;
  } else if (pointLabelNotationData.argumentMeasureName === Notation) {
    format = `${valueObject.argument} (${valueObject.seriesName})`;
  } else if (pointLabelNotationData.measureNameValue === Notation) {
    format =
    `(${valueObject.seriesName}): ${valueObject.value}`;
  } else if (pointLabelNotationData.argumentMeasureNameValue === Notation) {
    format =
    `${valueObject.argument} (${valueObject.seriesName}): ${valueObject.value}`;
  }

  return format;
};

export const directionFormat = (direction) => {
  let format = 0;

  if (pointLabelDirectionData.left === direction) {
    format = -90;
  } else if (pointLabelDirectionData.right === direction) {
    format = 90;
  }

  return format;
};

export const getSeriesOptionType = (fieldId, seriesOptions) => {
  if (!seriesOptions) return 'bar';
  let selectedSeriesOption = null;
  seriesOptions.forEach((item) => {
    if (item.fieldId === fieldId) {
      selectedSeriesOption = item;
    };
  });

  if (selectedSeriesOption == null) return 'bar';

  return selectedSeriesOption.type;
};

export const getSeriesGeneralOption = (seriesOptions) => {
  const auxiliaryAxis =
   !seriesOptions ? false : isUsedAuxiliaryAxis(seriesOptions);
  const ignoreEmptyPoints =
   !seriesOptions ? false : seriesOptions[0].general.ignoreEmptyPoints;
  const pointerMarker =
   !seriesOptions ? true : seriesOptions[0].general.pointerMarker;
  const reverseView =
   !seriesOptions ? false : seriesOptions[0].general.reverseView;

  return {
    auxiliaryAxis,
    ignoreEmptyPoints,
    pointerMarker,
    reverseView
  };
};

export const getAuxiliaryAxis = (fieldId, seriesOptions) => {
  if (!seriesOptions) return 'left';
  const selectedDataField =
    seriesOptions.filter((item) => item.fieldId === fieldId)[0];
  if (!selectedDataField) return 'left';

  return selectedDataField.general.auxiliaryAxis ? 'right' : 'left';
};

export const overlappingFormat = (seriesOptions) => {
  if (!seriesOptions) return 'none';
  let format = '';
  const overlapping = !seriesOptions ?
    overlappingModeData.default :
    seriesOptions[0].pointLabel.overlayMode;
  if (overlapping === overlappingModeData.default) {
    format = 'none';
  } else if (overlapping === overlappingModeData.hidden) {
    format = 'hide';
  } else if (overlapping === overlappingModeData.overlappingLabelReLocate) {
    format = 'stack';
  }
  return format;
};
