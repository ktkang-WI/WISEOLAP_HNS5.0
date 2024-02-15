import axios from 'axios';

const configPath = '/config';
const reportPath = '/report';

export const getFolderReports = () => {
  const res = axios.get(configPath + '/folder-report');
  return res;
};

export const getFolders = () => {
  const res = axios.get(configPath + '/folder');
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

  constructor({reportId = 0, reportNm = '', reportSubTitle = '', fldId = 0,
    fldLvl = 0, fldNm = '', fldParentId = 0, fldType = 'PUBLIC',
    reportOrdinal = 0, reportType ='', reportTag = '',
    reportDesc = ''}) {
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
  }

  updateReport = () => {
    // const report = {
    //   reportId: '' + this.reportId,
    //   reportNm: this.reportNm,
    //   reportSubTitle: this.reportSubTitle,
    //   fldId: '' + this.fldId,
    //   fldType: this.fldType,
    //   reportOrdinal: this.reportOrdinal,
    //   reportType: this.reportType,
    //   reportTag: this.reportTag,
    //   reportDesc: this.reportDesc
    // };
    // const res = axios.patch(reportPath + '/report-save', report);
    // return res;
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
