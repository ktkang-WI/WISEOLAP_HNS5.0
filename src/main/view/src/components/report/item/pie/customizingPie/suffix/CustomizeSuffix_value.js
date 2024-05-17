// 정규식으로 천의 자리마다 , 생성.
const regularExpression = (num) => {
  return ((num).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ','));
};

const treatedNumber = (value, valueOfSuffix, precision, precisionType) => {
  const suffixValue = valueOfSuffix / 10 ** (precision);
  const mathRoundFunc = {
    round: Math.round,
    ceil: Math.ceil,
    floor: Math.floor
  };

  return (
    parseFloat(
        (mathRoundFunc[precisionType](value / suffixValue) * suffixValue) /
          valueOfSuffix).toFixed(precision)
  );
};

const autoSuffix = (value) => {
  let suffixValue = 1;
  let count = 0;

  while (value > 0) {
    if (value / 1000 < 1) break;

    value = value / 1000;
    count = count + 1;
  }

  if (count != 0) suffixValue = 10 ** (3 * count);

  return suffixValue;
};

export default function CustomizeSuffixValue(value, options) {
  const defaultSuffix = {1: '', 1000: 'K', 1000000: 'M', 1000000000: 'B'};
  const suffix = {
    'ones': 1,
    'thousands': 10 ** 3,
    'millions': 10 ** 6,
    'billions': 10 ** 9
  };
  const units = {
    'ones': options.suffixO,
    'thousands': options.suffixK,
    'millions': options.suffixM,
    'billions': options.suffixB
  };
  const unit = options.unit.toLowerCase();
  const valueOfSuffix = unit !== 'auto' ?
    suffix[unit] : autoSuffix(value);
  const precision = options.precision;

  const num = treatedNumber(
      value, valueOfSuffix, precision, options.precisionType
  );
  let resultNum = regularExpression(num);

  if (options.useDigitSeparator == false) resultNum = num;

  if (options.suffixEnabled) {
    if (unit === 'auto') {
      const customSuffix =
        units[Object.keys(suffix).find((key) => suffix[key] === valueOfSuffix)];

      return (resultNum + customSuffix);
    }

    return (resultNum + units[unit]);
  } else {
    if (unit === 'auto' || options.useAxis !== undefined) {
      return (resultNum + defaultSuffix[valueOfSuffix]);
    }

    return resultNum;
  }
};
