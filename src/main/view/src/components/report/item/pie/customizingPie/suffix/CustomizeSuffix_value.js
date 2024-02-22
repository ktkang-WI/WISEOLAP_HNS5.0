// 정규식으로 천의 자리마다 , 생성.
const regularExpression = (num) => {
  return ((num).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ','));
};

const treatedNumber = (value, valueOfSuffix, precsion, precsionOption) => {
  const suffixValue = valueOfSuffix / 10 ** (precsion);
  const mathRoundFunc = {
    round: Math.round,
    roundUp: Math.ceil,
    roundDown: Math.floor
  };

  return (
    parseFloat(
        (mathRoundFunc[precsionOption](value / suffixValue) * suffixValue) /
          valueOfSuffix).toFixed(precsion)
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
  const suffixO = options.suffixO ? options.suffixO : '';
  const suffix = {
    [suffixO]: 1,
    [options.suffixK]: 10 ** 3,
    [options.suffixM]: 10 ** 6,
    [options.suffixB]: 10 ** 9
  };
  const units = {
    'ones': suffixO,
    'thousands': options.suffixK,
    'millions': options.suffixM,
    'billions': options.suffixB
  };
  const unit = options.unit.toLowerCase();
  const valueOfSuffix = unit !== 'auto' ?
    suffix[units[unit]] : autoSuffix(value);
  const precision = options.precision;

  const num = treatedNumber(
      value, valueOfSuffix, precision, options.precisionType
  );
  let resultNum = regularExpression(num);

  if (options.useDigitSeparator == false) resultNum = num;

  if (options.suffixEnabled) {
    if (unit === 'auto') {
      const customSuffix =
        Object.keys(suffix).find((key) => suffix[key] === valueOfSuffix);

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
