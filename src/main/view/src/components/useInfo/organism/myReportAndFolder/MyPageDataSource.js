import localizedString from 'config/localization';
import UserFolderManagement from './UserFolderManagement';
import UserReprotManagement from './UserReportManagement';

export const Mode = {
  'FOLDER_MANAGEMENT': 'FOLDER_MANAGEMENT',
  'REPORT_MANAGEMENT': 'REPORT_MANAGEMENT'
};

export const dataSource = [
  {
    mode: Mode['FOLDER_MANAGEMENT'],
    title: localizedString.folder,
    component: <UserFolderManagement/>
  },
  // TODO: 보고서 설정 추후 추가
  {
    mode: Mode['REPORT_MANAGEMENT'],
    title: localizedString.report,
    component: <UserReprotManagement/>
  }
];
