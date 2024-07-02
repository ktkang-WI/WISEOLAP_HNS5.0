import localizedString from 'config/localization';
import ReportManagement from '../reportManagement/ReportManagement';
import FolderManagement from '../folderManagement/FolderManagement';
import {getFolderReports, getFolders, getMypageFolderReport}
  from 'models/config/reportFolderManagement/ReportFolderManagement';

export const Mode = {
  REPORT_MANAGEMENT: 'REPORT_MANAGEMENT',
  FOLDER_MANAGEMENT: 'FOLDER_MANAGEMENT'
};

export const managementData = [
  // 보고서
  {
    value: Mode.REPORT_MANAGEMENT,
    text: localizedString.reportManagement,
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
    value: Mode.FOLDER_MANAGEMENT,
    text: localizedString.folderManagement,
    component: FolderManagement,
    data: async (myPageFlag) => {
      if (myPageFlag) {
        const folders = await getMypageFolderReport();
        if (folders.status == 200) {
          return folders;
        }
      }
      return getFolders();
    },
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
