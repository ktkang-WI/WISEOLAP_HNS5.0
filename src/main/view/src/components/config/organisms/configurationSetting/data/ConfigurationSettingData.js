import localizedString from 'config/localization';
import GeneralConfigure from '../generalConfigure/GeneralConfigure';
import ReportConfigure from '../reportConfigure/ReportConfigure';

export const Mode = {
  'GENERATECONFIGURE': 'GENERATECONFIGURE',
  'REPORTCONFIGURE': 'REPORTCONFIGURE'
};

export const dataSource = [
  {
    mode: Mode['GENERATECONFIGURE'],
    title: localizedString.generateConfigure,
    component: <GeneralConfigure/>
  },
  {
    mode: Mode['REPORTCONFIGURE'],
    title: localizedString.reportConfigure,
    component: <ReportConfigure/>
  }
];
