import customizeSuffixPercent
  from './suffix/CustomizeSuffix_percent';
import customizeSuffixValue
  from './suffix/CustomizeSuffix_value';

// 툴팁 및 라벨에 적용
const CustomizeOption = (e, pieOption, type) => {
  // let text = '';
  const format = pieOption.format;
  const formatStrings = format.split('&');
  if (format === 'none') {
    return null;
  }

  const text = formatStrings.reduce((acc, curr) => {
    let value = '';
    // 접두사 사용 여부에 따른 접두사 추가.
    const prefix = pieOption.customPrefix ? pieOption.inputPrefix : '';

    if (curr.toLowerCase() === 'argument') {
      value = e.argument;
    } else if (curr.toLowerCase() === 'value') {
      value = prefix + customizeSuffixValue(e.value, pieOption);
    } else {
      value = customizeSuffixPercent(e.percent, pieOption);
    };

    if (formatStrings.length > 1) {
      if (curr.toLowerCase() == 'argument') {
        value += ': ';
      } else if (curr.toLowerCase() == 'percent') {
        value = ' (' + value + ')';
      }
    };

    acc += value;
    return acc;
  }, '');

  // 툴팁이면 툴팁박스 반환.
  if (type === 'tooltip') {
    return (<div>{text}</div>);
  } else { // 라벨이면 텍스트만 반환.
    return (text);
  }
};
export default CustomizeOption;
