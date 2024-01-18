import NumberFormatUtility from 'components/utils/NumberFormatUtility';
import localizedString from 'config/localization';

const customizeTooltip = (info, isLabel, formats) => {
  const formData = formats[info.point.series.tag];
  let labelFormat = 'Number';
  let labelUnit = 'Ones';
  let labelPrecision = 0;
  let labelPrecisionOption = localizedString.round;
  let labelSeparator = true;
  let labelSuffixEnabled = false;
  let labelSuffix = {
    O: '',
    K: localizedString.k,
    M: localizedString.m,
    B: localizedString.b
  };
  if (formData) {
    labelFormat = formData.format.formatType;
    labelUnit = formData.format.unit;
    labelPrecision = formData.format.precision;
    labelPrecisionOption = formData.format.precisionType;
    labelSeparator = formData.format.useDigitSeparator;
    labelSuffixEnabled = formData.format.suffixEnabled;
    labelSuffix = {
      O: formData.format.suffixO,
      K: formData.format.suffixK,
      M: formData.format.suffixM,
      B: formData.format.suffixB
    };
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
