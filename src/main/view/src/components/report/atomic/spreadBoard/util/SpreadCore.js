const GC = require('@grapecity/spread-sheets');
require('@grapecity/spread-sheets-charts');
require('@grapecity/spread-sheets-print');
require('@grapecity/spread-sheets-barcode');
require('@grapecity/spread-sheets-shapes');
require('@grapecity/spread-sheets-pdf');
require('@grapecity/spread-sheets-pivot-addon');
require('@grapecity/spread-sheets-tablesheet');
const ExcelIO = require('@grapecity/spread-excelio');
require('@grapecity/spread-sheets-resources-ko');
require('@grapecity/spread-sheets-designer-resources-ko');
require('@grapecity/spread-sheets-designer');
GC.Spread.Common.CultureManager.culture('ko-kr');
import {getSpread} from 'models/config/preferences/Preferences';

// set Spread License
export const setSpreadLicense = async () => {
  const res = await getSpread();
  if (res.status !== 200) {
    console.error('get spread License error');
    return;
  }
  const {SPREAD_JS_LICENSE, SPREAD_JS_DESIGNER_LICENSE} = res.data;
  GC.Spread.Sheets.LicenseKey = SPREAD_JS_LICENSE;
  ExcelIO.LicenseKey = SPREAD_JS_LICENSE;
  GC.Spread.Sheets.Designer.LicenseKey = SPREAD_JS_DESIGNER_LICENSE;
};

// spread Core Objects
// eslint-disable-next-line prefer-const
export let designerRef;
export const setDesignerRef = (ref) => {
  designerRef = ref;
};
export const excelIO = new GC.Spread.Excel.IO();
export const sheets = GC.Spread.Sheets;

// eslint-disable-next-line prefer-const
export let workbookJSONs = {};
export const insertWorkbookJSON = ({reportId, workbookJSON}) => {
  workbookJSONs[reportId] = workbookJSON;
};
export const deleteWorkbookJSON = (reportId) => {
  delete workbookJSONs[reportId];
};
export const updateWorkbookJSON = ({reportId, workbookJSON}) => {

};
export const getWorkbookJSON = (reportId) => {
  return workbookJSONs[reportId];
};
export const resetWorkbookJSON = ({reportId, workbookJSON}) => {
  workbookJSONs = {};
  workbookJSONs[reportId] = workbookJSON;
};

