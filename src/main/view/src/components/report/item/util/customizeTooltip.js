import NumberFormatUtility from 'components/utils/NumberFormatUtility';

const customizeTooltip = (info, isLabel) => {
  console.log('info', info);
  const labelFormat = 'Number';
  const labelUnit = 'Ones';
  const labelPrecision = 0;
  const labelPrecisionOption = '반올림';
  const labelSeparator = true;
  const labelSuffixEnabled = false;
  const labelSuffix = {
    O: '',
    K: '천',
    M: '백만',
    B: '십억'
  };

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
