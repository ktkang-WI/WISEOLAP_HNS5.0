import localizedString from 'config/localization';

export const farmatType = [
  {value: 'Auto', caption: 'Auto'},
  {value: 'General', caption: 'General'},
  {value: 'Number', caption: 'Number'},
  {value: 'Currency', caption: 'Currency'},
  {value: 'Scientific', caption: 'Scientific'},
  {value: 'Percent', caption: 'Percent'}
];

export const unitType = [
  {value: 'Auto', caption: 'Auto'},
  {value: 'Ones', caption: 'Ones'},
  {value: 'Thousands', caption: 'Thousands'},
  {value: 'Millions', caption: 'Millions'},
  {value: 'Billions', caption: 'Billions'}
];

export const precisionType = [
  {value: 'round', caption: localizedString.round},
  {value: 'ceil', caption: localizedString.ceil},
  {value: 'floor', caption: localizedString.floor}
];
