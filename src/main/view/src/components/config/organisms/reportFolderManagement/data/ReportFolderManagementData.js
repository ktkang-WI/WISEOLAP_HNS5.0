import localizedString from 'config/localization';
import ReportManagement from '../reportManagement/ReportManagement';
import FolderManagement from '../folderManagement/FolderManagement';
import {Folder, getFolderReports,
  getFolders,
  getMypageFolderReport,
  getUserList
}
  from 'models/config/reportFolderManagement/ReportFolderManagement';
import PrivateReportManagement
  from '../reportManagement/PrivateReportManagement';

export const Mode = {
  REPORT_MANAGEMENT: 'REPORT_MANAGEMENT',
  FOLDER_MANAGEMENT: 'FOLDER_MANAGEMENT',
  PRIVATE_REPORT_MANAGEMENT: 'PRIVATE_REPORT_MANAGEMENT'
};

export const managementData = [
  // 공용 보고서
  {
    value: Mode.REPORT_MANAGEMENT,
    text: '공용' + localizedString.reportManagement,
    component: ReportManagement,
    data: getFolderReports,
    update: (instance) => {
      return instance.updateReport();
    },
    remove: (instance) => {
      return instance.deleteReport();
    }
  },
  // 개인 보고서 관리.
  {
    value: 'PRIVATE_REPORT_MANAGEMENT',
    text: '개인'+ localizedString.reportManagement,
    component: PrivateReportManagement,
    data: getUserList
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

export const dataPrepro = ({data, mode}) => {
  if (mode === Mode.PRIVATE_REPORT_MANAGEMENT) return data;

  if (mode === Mode.REPORT_MANAGEMENT) {
    return data.reduce((acc, v) => {
      const folderIdList = acc.map((row) => row.fldId);

      if (!folderIdList.includes(v.fldId)) {
        const fldParentId = v.fldParentId === 0 ?
        v.fldParentId : 'f_' + v.fldParentId;
        acc.push({
          fldId: v.fldId,
          fldLvl: v.fldLvl,
          fldNm: v.fldNm,
          fldOrdinal: v.fldOrdinal,
          parentId: fldParentId,
          key: 'f_' + v.fldId,
          name: v.fldNm,
          type: 'folder'
        });
      }

      acc.push({
        ...v,
        key: 'r_'+ v.reportId,
        parentId: 'f_' + v.fldId,
        name: v.reportNm,
        fldParentNm: v.fldNm
      });

      return acc;
    }, []);
  }

  if (mode === Mode.FOLDER_MANAGEMENT) {
    const getParentFldNm = (fld) => {
      const parentFld = data.find((d) => d.fldId === fld.fldParentId);
      return parentFld ? parentFld.fldNm : null; // 부모 필드가 없을 경우 null 반환
    };
    return data.map((row) => {
      let newRow = {};
      if (row.fldParentId === 0) {
        newRow = {
          ...row,
          fldParentNm: '/root'
        };
      } else {
        newRow = {
          ...row,
          fldParentNm: getParentFldNm(row)
        };
      }
      return new Folder(newRow);
    });
  }
};
