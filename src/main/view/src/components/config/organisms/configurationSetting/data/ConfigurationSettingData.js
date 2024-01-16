import localizedString from 'config/localization';
import GeneralConfigure from '../../generalConfigure/GeneralConfigure';

export const Mode = {
  'GENERATECONFIGURE': 'GENERATECONFIGURE'
};

export const dataSource = [
  {
    mode: Mode['GENERATECONFIGURE'],
    title: localizedString.generateConfigure,
    component: <GeneralConfigure/>
  }
];
