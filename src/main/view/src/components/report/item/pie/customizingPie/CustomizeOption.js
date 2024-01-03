import localizedString from 'config/localization';
import customizeSuffixPercent
  from './suffix/CustomizeSuffix_percent';
import customizeSuffixValue
  from './suffix/CustomizeSuffix_value';

// 툴팁 및 라벨에 적용
const CustomizeOption = (e, pieOption, type) => {
  let text = '';
  const prefix = pieOption.customPrefix ? pieOption.inputPrefix : '';
  if (pieOption.format == localizedString.formatItems[1]) {
    text = e.argument;
  }
  if (pieOption.format == localizedString.formatItems[2]) { // 값 표현.
    text = prefix + customizeSuffixValue(e.value, pieOption);
  }
  if (pieOption.format == localizedString.formatItems[3]) { // 퍼센트 표현.
    text = customizeSuffixPercent(e.percent, pieOption);
  }
  if (pieOption.format == localizedString.formatItems[4]) {
    text =
      e.argument + ': '+
      prefix +
      customizeSuffixValue(e.value, pieOption);
  }
  if (pieOption.format == localizedString.formatItems[5]) {
    text =
      prefix +
      customizeSuffixValue(e.value, pieOption)+ ' (' +
      customizeSuffixPercent(e.percent, pieOption) + ')';
  }
  if (pieOption.format == localizedString.formatItems[6]) {
    text =
      e.argument + ': ' + '(' +
      customizeSuffixPercent(e.percent, pieOption) + ')';
  }
  if (pieOption.format == localizedString.formatItems[7]) {
    text =
      e.argument + ': ' +
      prefix +
      customizeSuffixValue(e.value, pieOption) +
      ' ('+customizeSuffixPercent(e.percent, pieOption)+')';
  }
  if (pieOption.format == localizedString.formatItems[0]) {
    return null;
  }
  // 툴팁이면 툴팁박스 반환.
  if (type === 'tooltip') {
    return (<div>{text}</div>);
  } else { // 라벨이면 텍스트만 반환.
    return (text);
  }
};
export default CustomizeOption;
