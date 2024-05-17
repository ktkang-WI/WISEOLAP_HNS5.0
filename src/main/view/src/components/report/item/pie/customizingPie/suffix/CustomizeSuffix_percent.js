const treatedNumber = (value, customSuffix, precision, precisionType) => {
  const suffixValue = customSuffix * (10 ** (precision));
  const mathRoundFunc = {
    round: Math.round,
    ceil: Math.ceil,
    floor: Math.floor
  };

  return (
    parseFloat(
        mathRoundFunc[precisionType](value * suffixValue) / suffixValue
    ).toFixed(precision)
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
