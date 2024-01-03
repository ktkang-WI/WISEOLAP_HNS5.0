import localizedString from 'config/localization';

const regularExpression = (num) => { // 정규식으로 천의 자리마다 , 생성.
  return ((num).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ','));
};
const treatedNumber = (value, customSuffix, degree, degreeOption) => {
  const suffixValue = customSuffix/10**(degree);

  if (degreeOption === localizedString.round) {
    return (
      parseFloat(
          (Math.round(value/suffixValue)*suffixValue)/customSuffix)
          .toFixed(degree)
    );
  } else if (degreeOption === localizedString.ceil) {
    return (
      parseFloat(
          (Math.ceil(value/suffixValue)*suffixValue)/customSuffix)
          .toFixed(degree)
    );
  } else {
    return (
      parseFloat(
          (Math.floor(value/suffixValue)*suffixValue)/customSuffix)
          .toFixed(degree)
    );
  }
};
export default function CustomizeSuffixValue(value, options) {
  const suffix = {
    [options.ones]: 1,
    [options.thousands]: 10**3,
    [options.milions]: 10**6,
    [options.bilions]: 10**9
  };
  const unit = options.unit.toLowerCase();
  const customSuffix = suffix[options[unit]];
  const degree = options.degree;

  const num = treatedNumber(
      value, customSuffix, degree, options.degreeOption
  );

  if (options.customSuffix) {
    return (regularExpression(num) + options[unit]);
  } else {
    return regularExpression(num);
  }
};
