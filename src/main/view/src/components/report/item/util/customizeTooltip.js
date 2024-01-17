import NumberFormatUtility from 'components/utils/NumberFormatUtility';
import localizedString from 'config/localization';

const customizeTooltip = (info, isLabel, formData) => {
  const matchingFormatOption = formData[info.point.series.tag];
  const labelFormat =
  matchingFormatOption?.format?.formatType || 'Number';
  const labelUnit =
  matchingFormatOption?.format?.unit || 'Ones';
  const labelPrecision =
  matchingFormatOption?.format?.precision || 0;
  const labelPrecisionOption =
  matchingFormatOption?.format?.precisionType || 'round';
  const labelSeparator =
  matchingFormatOption?.format?.useDigitSeparator!==undefined?
  matchingFormatOption?.format?.useDigitSeparator:true;
  const labelSuffixEnabled =
  matchingFormatOption?.format?.suffixEnabled!==undefined?
  matchingFormatOption?.format?.suffixEnabled:false;
  const labelSuffix = matchingFormatOption?.suffix || {
    O: '',
    K: localizedString.k,
    M: localizedString.m,
    B: localizedString.b
  };
  // Label과 Tooltip을 구분하여 Label인 경우 실수값으로 반환
  if (isLabel) {
    return NumberFormatUtility.formatNumber(
        info.value,
        labelFormat,
        labelUnit,
        labelPrecision,
        labelSeparator,
        undefined,
        labelSuffix,
        labelSuffixEnabled,
        labelPrecisionOption
    );
  }

  let text;
  if (info.rangeValue1Text !== undefined) {
    text =
      '<b>' +
      info.argumentText +
      '</b>' +
      '<br/>' +
      '<b>' +
      info.seriesName +
      '</b>: ' +
      NumberFormatUtility.formatNumber(
          info.rangeValue1,
          labelFormat,
          labelUnit,
          labelPrecision,
          labelSeparator,
          undefined,
          labelSuffix,
          labelSuffixEnabled,
          labelPrecisionOption
      ) +
      ' - ' +
      NumberFormatUtility.formatNumber(
          info.rangeValue2,
          labelFormat,
          labelUnit,
          labelPrecision,
          labelSeparator,
          undefined,
          labelSuffix,
          labelSuffixEnabled,
          labelPrecisionOption
      );
  } else if (info.sizeText !== undefined) {
    text =
      '<b>' +
      info.argumentText +
      '</b>' +
      '<br/>' +
      '<b>' +
      info.seriesName +
      '</b>: ' +
      NumberFormatUtility.formatNumber(
          info.value,
          labelFormat,
          labelUnit,
          labelPrecision,
          labelSeparator,
          undefined,
          labelSuffix,
          labelSuffixEnabled,
          labelPrecisionOption
      ) +
      ' - ' +
      NumberFormatUtility.formatNumber(
          info.size,
          labelFormat,
          labelUnit,
          labelPrecision,
          labelSeparator,
          undefined,
          labelSuffix,
          labelSuffixEnabled,
          labelPrecisionOption
      );
  } else {
    text =
      '<div>' +
      info.argumentText +
      '</div>' +
      '<div><b>' +
      info.seriesName +
      '</b>: ' +
      NumberFormatUtility.formatNumber(
          info.value,
          labelFormat,
          labelUnit,
          labelPrecision,
          labelSeparator,
          undefined,
          labelSuffix,
          labelSuffixEnabled,
          labelPrecisionOption
      ) +
      '</div>';
  }
  return {
    html: text
  };
};

export default customizeTooltip;
