import localizedString from 'config/localization';
import GeneralConfigure from '../generalConfigure/GeneralConfigure';
import ReportConfigure from '../reportConfigure/ReportConfigure';

export const Mode = {
  'GENERATE_CONFIGURE': 'GENERATE_CONFIGURE',
  'REPORT_CONFIGURE': 'REPORT_CONFIGURE'
};

export const tabItems = [
  {
    value: Mode['GENERATE_CONFIGURE'],
    text: localizedString.generateConfigure,
    component: GeneralConfigure
  },
  {
    value: Mode['REPORT_CONFIGURE'],
    text: localizedString.reportConfigure,
    component: ReportConfigure
  }
];
