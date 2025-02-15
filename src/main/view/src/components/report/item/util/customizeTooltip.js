import NumberFormatUtility from 'components/utils/NumberFormatUtility';
import localizedString from 'config/localization';

const customizeTooltip = (info, isLabel, formats) => {
  const formData = formats[info.point.series.tag.math];
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
    labelFormat = formData.formatType;
    labelUnit = formData.unit;
    labelPrecision = formData.precision;
    labelPrecisionOption = formData.precisionType;
    labelSeparator = formData.useDigitSeparator;
    labelSuffixEnabled = formData.suffixEnabled;
    labelSuffix = {
      O: formData.suffixO,
      K: formData.suffixK,
      M: formData.suffixM,
      B: formData.suffixB
    };
  };

  const formatNumber = (value) => {
    return NumberFormatUtility.formatNumber(
        value,
        labelFormat,
        labelUnit,
        labelPrecision,
        labelSeparator,
        undefined,
        labelSuffix,
        labelSuffixEnabled,
        labelPrecisionOption
    );
  };

  // Label과 Tooltip을 구분하여 Label인 경우 실수값으로 반환
  if (isLabel) {
    return formatNumber(info.value);
  }

  let text = '<b>' + info.argumentText + '</b>' +
           '<br/><b>' + info.seriesName + '</b>: ';

  if (info.rangeValue1Text && info.rangeValue2Text) {
    text += formatNumber(info.rangeValue1);
    text += ' - ';
    text += formatNumber(info.rangeValue2);
  } else {
    text += formatNumber(info.value);
    if (info.sizeText) {
      text += ' - ';
      text += formatNumber(info.size);
    }
  }
  return {
    html: text
  };
};

export default customizeTooltip;
