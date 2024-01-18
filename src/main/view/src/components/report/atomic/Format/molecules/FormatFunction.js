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
  const formData = component.option('formData');
  // 옵션을 목적별로 분리하여 일괄 처리
  const setDigitOption = (value) => {
    component.getEditor('unit').option('disabled', value);
    component.getEditor('useDigitSeparator').option('disabled', value);
    component.getEditor('suffixEnabled').option('disabled', value);
    setSuffixOption(value ? true : !formData.suffixEnabled);
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
    setFloatOption(true);
  } else if (['Scientific', 'Percent'].includes(value)) {
    setDigitOption(true);
    setFloatOption(false);
  } else if (['Number', 'Currency'].includes(value)) {
    setDigitOption(false);
    setFloatOption(false);
  }
  if (dataField == 'suffixEnabled') {
    setSuffixOption(!value);
  }
};
