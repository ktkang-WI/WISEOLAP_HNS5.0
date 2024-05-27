import localizedString from 'config/localization';
import GeneralConfigure from '../generalConfigure/GeneralConfigure';

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
  // TODO: 보고서 설정 추후 추가
  {
    mode: Mode['REPORT_CONFIGURE'],
    title: localizedString.reportConfigure
    // component: <ReportConfigure/>
  }
];
