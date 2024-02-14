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
  const suffix = {
    [options.ones]: 1,
    [options.thousands]: 10 ** 3,
    [options.millions]: 10 ** 6,
    [options.billions]: 10 ** 9
  };
  const unit = options.unit.toLowerCase();
  const valueOfSuffix = unit !== 'auto' ?
    suffix[options[unit]] : autoSuffix(value);
  const precsion = options.precsion;

  const num = treatedNumber(
      value, valueOfSuffix, precsion, options.precsionOption
  );

  if (options.customSuffix) {
    if (unit === 'auto') {
      const customSuffix =
        Object.keys(suffix).find((key) => suffix[key] === valueOfSuffix);

      return (regularExpression(num) + customSuffix);
    }

    return (regularExpression(num) + options[unit]);
  } else {
    if (unit === 'auto') {
      return (regularExpression(num) + defaultSuffix[valueOfSuffix]);
    }

    return regularExpression(num);
  }
};
