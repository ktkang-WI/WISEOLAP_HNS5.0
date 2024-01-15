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

export const updateFomatType = (e, value) => {
  const isAutoOrGeneral =
  value === 'Auto' || value === 'General';
  const isNumberOrCurrency =
  value === 'Number' || value === 'Currency';
  const isScientificOrPercent =
  value === 'Scientific' || value === 'Percent';

  if (isAutoOrGeneral) {
    e.component.getEditor('unit').option('disabled', true);
    e.component.getEditor('suffixEnabled').option('disabled', true);
    e.component.getEditor('suffixO').option('disabled', true);
    e.component.getEditor('suffixK').option('disabled', true);
    e.component.getEditor('suffixM').option('disabled', true);
    e.component.getEditor('suffixB').option('disabled', true);
    e.component.getEditor('precision').option('disabled', true);
    e.component.getEditor('precisionType').option('disabled', true);
    e.component.getEditor('useDigitSeparator').option('disabled', true);
  } else if (isScientificOrPercent) {
    e.component.getEditor('unit').option('disabled', true);
    e.component.getEditor('suffixEnabled').option('disabled', true);
    e.component.getEditor('suffixO').option('disabled', true);
    e.component.getEditor('suffixK').option('disabled', true);
    e.component.getEditor('suffixM').option('disabled', true);
    e.component.getEditor('suffixB').option('disabled', true);
    e.component.getEditor('precision').option('disabled', false);
    e.component.getEditor('precisionType').option('disabled', false);
    e.component.getEditor('useDigitSeparator').option('disabled', true);
  } else if (isNumberOrCurrency) {
    e.component.getEditor('unit').option('disabled', false);
    e.component.getEditor('suffixEnabled').option('disabled', false);
    e.component.getEditor('suffixO').option('disabled', true);
    e.component.getEditor('suffixK').option('disabled', true);
    e.component.getEditor('suffixM').option('disabled', true);
    e.component.getEditor('suffixB').option('disabled', true);
    e.component.getEditor('precision').option('disabled', false);
    e.component.getEditor('precisionType').option('disabled', false);
    e.component.getEditor('useDigitSeparator').option('disabled', false);
  }
};

export const updateSuffix = (e, value) => {
  if (!value) {
    e.component.getEditor('suffixO').option('disabled', true);
    e.component.getEditor('suffixK').option('disabled', true);
    e.component.getEditor('suffixM').option('disabled', true);
    e.component.getEditor('suffixB').option('disabled', true);
  } else {
    e.component.getEditor('suffixO').option('disabled', false);
    e.component.getEditor('suffixK').option('disabled', false);
    e.component.getEditor('suffixM').option('disabled', false);
    e.component.getEditor('suffixB').option('disabled', false);
  }
};
