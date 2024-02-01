import localizedString from 'config/localization';
import GeneralConfigure from '../generalConfigure/GeneralConfigure';
import ReportConfigure from '../reportConfigure/ReportConfigure';

export const Mode = {
  'GENERATE_CONFIGURE': 'GENERATE_CONFIGURE',
  'REPORT_CONFIGURE': 'REPORT_CONFIGURE'
};

export const dataSource = [
  {
    mode: Mode['GENERATE_CONFIGURE'],
    title: localizedString.generateConfigure,
    component: <GeneralConfigure/>
  },
  {
    mode: Mode['REPORT_CONFIGURE'],
    title: localizedString.reportConfigure,
    component: <ReportConfigure/>
  }
];
