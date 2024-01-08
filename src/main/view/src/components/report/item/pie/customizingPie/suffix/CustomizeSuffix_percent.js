const treatedNumber = (value, customSuffix, degree, degreeOption) => {
  const suffixValue = customSuffix * (10 ** (degree));
  const mathRoundFunc = {
    round: Math.round,
    roundUp: Math.ceil,
    roundDown: Math.floor
  };

  return (
    parseFloat(
        mathRoundFunc[degreeOption](value*suffixValue)/suffixValue
    ).toFixed(degree)
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
  const degree = options.degree;

  const num = treatedNumber(
      value * 100, customSuffix, degree, options.degreeOption
  );

  return num + '%';
};
