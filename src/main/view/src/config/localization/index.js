import LocalizedStrings from 'react-localization';
import ko from './language/ko.json';
import en from './language/en.json';

const strings = new LocalizedStrings({
  en,
  ko
});

// 만약 제대로 적용되지 않을시 Language 강제 설정
// strings.setLanguage('ko');

export default strings;
