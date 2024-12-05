import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const configPath = document.location.origin + contextRoot + '/config';

const reportPath = document.location.origin + contextRoot + '/report';

export const getFolderReports = () => {
  const res = axios.get(configPath + '/folder-report');
  return res;
};
export const getPrivateFolderReports = (param) => {
  const res = axios.get(configPath + '/folder-report/private', {params: param});
  return res;
};
export const getUserList = () => {
  const res = axios.get(configPath + '/folder-report/userList');
  return res;
};
export const getFolderPubs = () => {
  const res = axios.get(configPath + '/folder-pub');
  return res;
};
export const getFolders = () => {
  const res = axios.get(configPath + '/folder');
  return res;
};

export const getMypageFolderReport = () => {
  const res = axios.get(configPath + '/my-page-folder');
  return res;
};

export const createMyPageFolder = (param) => {
  const res =
    axios.post(configPath + '/my-page-folder', null, {params: param});
  return res;
};

export const deleteMyPageFolder = (param) => {
  const res =
    axios.post(configPath + '/my-page-folder/delete', param);
  return res;
};

export const updateMyPageFolder = (param) => {
  const res =
    axios.patch(
        configPath + '/my-page-folder/edit-name', null, {params: param}
    );
  return res;
};

export const updateMyPageReport = (param) => {
  const res =
    axios.patch(configPath + '/my-page-folder', param);
  return res;
};

export const getUserDesignerConfig = () => {
  const res =
    axios.get(configPath + '/my-page-designer-config');
  return res;
};

export const updateDesignerConfig = (param) => {
  const res =
    axios.post(configPath + '/my-page-designer-config', null, {params: param});
  return res;
};

export const resetDesignerConfig = () => {
  const res =
    axios.post(
        configPath + '/my-page-designer-config/reset', null, {params: null});
  return res;
};

export const updateMyPageFolderOrder = (param) => {
  const res =
    axios.patch(configPath + '/my-page-folder/move-folder', param, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  return res;
};

export const updateMyPageReportOrder = (param) => {
  const res =
    axios.patch(configPath + '/my-page-folder/move-report', param);
  return res;
};

export class Report {
  reportId = 0;
  reportNm = '';
  reportSubTitle = '';
  fldId = 0;
  fldLvl = 0;
  fldNm = '';
  fldParentId = 0;
  fldType = '';
  reportOrdinal = 0;
  reportType = '';
  regDt = ''; // 게시 일자
  regUserNm = ''; // 게시자
  modDt = ''; // 최종 수정 일자
  modUserNm = ''; // 최종 수정자
  requester = ''; // 요청자
  reportTag = '';
  reportDesc = '';
  fldParentNm = '';
  promptYn = false;
  maxReportPeriodYn = false;

  constructor({reportId = 0, reportNm = '', reportSubTitle = '', fldId = 0,
    fldLvl = 0, fldNm = '', fldParentId = 0, fldType = 'PUBLIC',
    reportOrdinal = 0, reportType ='', reportTag = '',
    regDt = '', regUserNm = '', modDt = '', modUserNm = '', requester = '',
    reportDesc = '', fldParentNm = '', promptYn = false,
    maxReportPeriodYn = false, cube=false}) {
    this.reportId = reportId;
    this.reportNm = reportNm;
    this.reportSubTitle = reportSubTitle;
    this.fldId = fldId;
    this.fldLvl = fldLvl;
    this.fldNm = fldNm;
    this.fldParentId = fldParentId;
    this.fldType = fldType;
    this.reportOrdinal = reportOrdinal;
    this.reportType = reportType;
    this.reportTag = reportTag;
    this.regDt = regDt; // 게시 일자
    this.regUserNm = regUserNm; // 게시자
    this.modDt = modDt; // 최종 수정 일자
    this.modUserNm = modUserNm; // 최종 수정자
    this.requester = requester; // 요청자
    this.reportDesc = reportDesc;
    this.fldParentNm = fldParentNm;
    this.promptYn = promptYn;
    this.maxReportPeriodYn = maxReportPeriodYn;
    this.cube = cube;
  }

  updateReport = () => {
    const report = {
      reportId: this.reportId,
      reportNm: this.reportNm,
      reportSubTitle: this.reportSubTitle,
      fldId: this.fldId,
      fldType: this.fldType,
      reportOrdinal: this.reportOrdinal,
      reportType: this.reportType,
      reportTag: this.reportTag,
      reportDesc: this.reportDesc,
      promptYn: this.promptYn,
      maxReportPeriodYn: this.maxReportPeriodYn
    };
    const res = axios.patch(reportPath + '/update', report);
    return res;
  };

  deleteReport = () => {
    const report = {
      reportId: '' + this.reportId
    };
    const res = axios.patch(reportPath + '/report-delete', report);
    return res;
  };
}

export class Folder {
  fldId = 0;
  fldNm = '';
  fldLvl = 0;
  fldParentId = '';
  fldParentNm = '';
  fldOrdinal = 0;
  fldDesc = '';

  constructor({fldId = 0, fldNm = '', fldLvl = 0, fldParentId = '',
    fldParentNm = '', fldOrdinal = 0, fldDesc = ''}) {
    this.fldId = fldId;
    this.fldNm = fldNm;
    this.fldLvl = fldLvl;
    this.fldParentId = fldParentId;
    this.fldParentNm = fldParentNm;
    this.fldOrdinal = fldOrdinal;
    this.fldDesc = fldDesc;
  }

  createFolder = () => {
    const folder = {
      fldNm: this.fldNm,
      fldLvl: this.fldLvl,
      fldParentId: this.fldParentId,
      fldOrdinal: this.fldOrdinal,
      fldDesc: this.fldDesc
    };

    const res = axios.post(configPath + '/folder', null, {params: folder});
    return res;
  };

  updateFolder = () => {
    const folder = {
      fldId: this.fldId,
      fldNm: this.fldNm,
      fldLvl: this.fldLvl,
      fldParentId: this.fldParentId,
      fldOrdinal: this.fldOrdinal,
      fldDesc: this.fldDesc
    };

    const res = axios.patch(configPath + '/folder', null, {params: folder});
    return res;
  };

  deleteFolder = () => {
    const folder = {
      fldId: this.fldId
    };

    const res = axios.delete(configPath + '/folder', {params: folder});
    return res;
  };
}
