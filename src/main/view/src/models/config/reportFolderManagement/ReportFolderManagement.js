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
    axios.patch(configPath + '/my-page-folder', null, {params: param});
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
  reportTag = '';
  reportDesc = '';
  fldParentNm = '';
  promptYn = true;

  constructor({reportId = 0, reportNm = '', reportSubTitle = '', fldId = 0,
    fldLvl = 0, fldNm = '', fldParentId = 0, fldType = 'PUBLIC',
    reportOrdinal = 0, reportType ='', reportTag = '',
    reportDesc = '', fldParentNm = '', promptYn = true}) {
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
    this.reportDesc = reportDesc;
    this.fldParentNm = fldParentNm;
    this.promptYn = promptYn;
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
      promptYn: this.promptYn
    };
    const res = axios.patch(reportPath + '/update', null, {params: report});
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
