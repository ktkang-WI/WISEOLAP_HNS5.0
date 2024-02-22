const GC = require('@grapecity/spread-sheets');
const ExcelIO = require('@grapecity/spread-excelio');
require('@grapecity/spread-sheets-charts');
require('@grapecity/spread-sheets-print');
require('@grapecity/spread-sheets-barcode');
require('@grapecity/spread-sheets-shapes');
require('@grapecity/spread-sheets-pdf');
require('@grapecity/spread-sheets-pivot-addon');
require('@grapecity/spread-sheets-tablesheet');
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
export const excelIO = new GC.Spread.Excel.IO();
export const sheets = GC.Spread.Sheets;
export let designer;
export const setDesigner = (newDesigner) => {
  designer = newDesigner;
};

// eslint-disable-next-line prefer-const
export let workbooks = {};
export const insertWorkbook = ({reportId, workbook}) => {
  workbooks[reportId] = workbook;
};
export const deleteWorkbook = (reportId) => {
  delete workbooks[reportId];
};
export const updateWorkbook = ({reportId, workbook}) => {
  workbooks = {};
  workbooks[reportId] = workbook;
};
export const getWorkbook = (reportId) => {
  return workbooks[reportId];
};
