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
  const customSuffix = 1;
  const precision = options.precision;

  const num = treatedNumber(
      value * 100, customSuffix, precision, options.precisionType
  );

  return num + '%';
};
