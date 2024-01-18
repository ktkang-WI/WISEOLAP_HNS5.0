import NumberFormatUtility from 'components/utils/NumberFormatUtility';

export const formatValue = (options) => {
  const value = 1234567890.123;
  const formatted = NumberFormatUtility.formatNumber(
      value,
      options.formatType,
      options.unit,
      options.precision,
      options.useDigitSeparator,
      undefined,
      options.suffix,
      options.suffixEnabled,
      options.precisionType
  );
  return formatted;
};

export const updateFomatType = ({component, dataField, value}) => {
  // 옵션을 목적별로 분리하여 일괄 처리
  const setDigitOption = (value) => {
    component.getEditor('unit').option('disabled', value);
    component.getEditor('useDigitSeparator').option('disabled', value);
    component.getEditor('suffixEnabled').option('disabled', value);
  };

  const setSuffixOption = (value) => {
    component.getEditor('suffixO').option('disabled', value);
    component.getEditor('suffixK').option('disabled', value);
    component.getEditor('suffixM').option('disabled', value);
    component.getEditor('suffixB').option('disabled', value);
  };

  const setFloatOption = (value) => {
    component.getEditor('precision').option('disabled', value);
    component.getEditor('precisionType').option('disabled', value);
  };

  if (['Auto', 'General'].includes(value)) {
    setDigitOption(true);
    setSuffixOption(true);
    setFloatOption(true);
  } else if (['Scientific', 'Percent'].includes(value)) {
    setDigitOption(true);
    setSuffixOption(true);
    setFloatOption(false);
  } else if (['Number', 'Currency'].includes(value)) {
    setDigitOption(false);
    if (!dataField.suffixEnabled) {
      setSuffixOption(true);
    } else if (dataField.suffixEnabled) {
      setSuffixOption(false);
    }
    setFloatOption(false);
  } else if (dataField == 'suffixEnabled' && !value) {
    component.getEditor('suffixO').option('disabled', true);
    component.getEditor('suffixK').option('disabled', true);
    component.getEditor('suffixM').option('disabled', true);
    component.getEditor('suffixB').option('disabled', true);
  } else if (dataField == 'suffixEnabled' && value) {
    component.getEditor('suffixO').option('disabled', false);
    component.getEditor('suffixK').option('disabled', false);
    component.getEditor('suffixM').option('disabled', false);
    component.getEditor('suffixB').option('disabled', false);
  }
};
