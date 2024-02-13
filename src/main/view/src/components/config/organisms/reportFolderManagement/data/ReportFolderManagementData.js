import localizedString from 'config/localization';
import ReportManagement from '../reportManagement/ReportManagement';
import FolderManagement from '../folderManagement/FolderManagement';
import {getFolderReports, getFolders}
  from 'models/config/reportFolderManagement/ReportFolderManagement';

export const Mode = {
  REPORT_MANAGEMENT: 'REPORT_MANAGEMENT',
  FOLDER_MANAGEMENT: 'FOLDER_MANAGEMENT'
};

export const managementData = [
  // 보고서
  {
    mode: Mode.REPORT_MANAGEMENT,
    title: localizedString.reportManagement,
    component: ReportManagement,
    data: getFolderReports,
    update: (instance) => {
      return instance.updateReport();
    },
    remove: (instance) => {
      return instance.deleteReport();
    }
  },
  // 폴더
  {
    mode: Mode.FOLDER_MANAGEMENT,
    title: localizedString.folderManagement,
    component: FolderManagement,
    data: getFolders,
    save: (instance) => {
      return instance.createFolder();
    },
    update: (instance) => {
      return instance.updateFolder();
    },
    remove: (instance) => {
      return instance.deleteFolder();
    }
  }
];
