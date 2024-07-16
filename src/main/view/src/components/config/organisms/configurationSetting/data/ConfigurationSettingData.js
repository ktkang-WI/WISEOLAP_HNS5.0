import localizedString from 'config/localization';
import GeneralConfigure from '../generalConfigure/GeneralConfigure';
// import ReportConfigure from '../reportConfigure/ReportConfigure';
// import AdvancedConfigure from '../advancedConfigure/AdvancedConfigure';
import MenuConfgure from '../menuConfigure/MenuConfgure';

export const Mode = {
  'GENERATE_CONFIGURE': 'GENERATE_CONFIGURE',
  // 'ADVANCED_CONFIGURE': 'ADVANCED_CONFIGURE',
  // 'REPORT_CONFIGURE': 'REPORT_CONFIGURE',
  'MENU_CONFIGURE': 'MENU_CONFIGURE'
};

export const tabItems = [
  {
    value: Mode['GENERATE_CONFIGURE'],
    text: localizedString.generateConfigure,
    component: GeneralConfigure
  }, /*
  {
    value: Mode['ADVANCED_CONFIGURE'],
    text: localizedString.advancedConfigure,
    component: AdvancedConfigure
  },
  {
    value: Mode['REPORT_CONFIGURE'],
    text: localizedString.reportConfigure,
    component: ReportConfigure
  },*/
  {
    value: Mode['MENU_CONFIGURE'],
    text: localizedString.menuConfigure,
    component: MenuConfgure
  }
];
