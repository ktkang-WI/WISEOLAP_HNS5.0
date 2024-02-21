import customizeSuffixValue from
  './pie/customizingPie/suffix/CustomizeSuffix_value';

const autoSuffix = (value, defaultSuffix) => {
  let suffixValue = 1;
  let count = 0;

  if (value === 0) return '';

  while (value > 0) {
    if (value / 1000 < 1) break;

    value = value / 1000;
    count = count + 1;
  }

  if (count != 0) suffixValue = 10 ** (3 * count);

  return defaultSuffix[suffixValue];
};

const treatedNumber = (value, valueOfSuffix, precision, axisOption) => {
  const precisionType = axisOption.precisionType;
  const num = 10 ** valueOfSuffix;
  const mathRoundFunc = {
    round: Math.round,
    ceil: Math.ceil,
    floor: Math.floor
  };

  if (!value) return 0;

  return (
    parseFloat(
        (mathRoundFunc[precisionType](value / (num / 10)) * (num / 10)) /
        num).toFixed(precision)
  );
};

const ValueAxisCustomLabel = (e, axisOption) => {
  const defaultSuffix = {1: '', 1000: 'K', 1000000: 'M', 1000000000: 'B'};
  const unit = autoSuffix(e.value, defaultSuffix);
  const suffix = {
    'O': 1,
    'K': 10 ** 3,
    'M': 10 ** 6,
    'B': 10 ** 9
  };
  const map = {
    'Auto': '₩' +
      parseFloat(e.value ? e.value / suffix[unit] : 0).toFixed(2) + unit,
    'General': parseFloat(e.value).toFixed(e.value ? 3 : 0),
    'Scientific':
      treatedNumber(e.value, (e.value.toString().length - 1),
          axisOption.precision, axisOption).toString() +
          (e.value ? ('E' + '+' + (e.value.toString().length - 1)) : ''),
    'Percent': parseFloat(e.value * 1000).toFixed(axisOption.precision) + '%',
    'Number': customizeSuffixValue(e.value, axisOption),
    'Currency': '₩' + customizeSuffixValue(e.value, axisOption)
  };
  // , 처리
  return map[axisOption.formatType];
};
export default ValueAxisCustomLabel;
