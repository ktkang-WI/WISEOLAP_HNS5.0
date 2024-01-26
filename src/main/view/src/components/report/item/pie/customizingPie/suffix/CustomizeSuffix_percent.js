const treatedNumber = (value, customSuffix, precsion, precsionOption) => {
  const suffixValue = customSuffix * (10 ** (precsion));
  const mathRoundFunc = {
    round: Math.round,
    roundUp: Math.ceil,
    roundDown: Math.floor
  };

  return (
    parseFloat(
        mathRoundFunc[precsionOption](value * suffixValue) / suffixValue
    ).toFixed(precsion)
  );
};

export default function CustomizeSuffixValue(value, options) {
  const suffix = {
    [options.ones]: 1,
    [options.thousands]: 10 ** 3,
    [options.millions]: 10 ** 6,
    [options.billions]: 10 ** 9
  };
  const unit = options.unit.toLowerCase();
  const customSuffix = suffix[options[unit]];
  const precsion = options.precsion;

  const num = treatedNumber(
      value * 100, customSuffix, precsion, options.precsionOption
  );

  return num + '%';
};
