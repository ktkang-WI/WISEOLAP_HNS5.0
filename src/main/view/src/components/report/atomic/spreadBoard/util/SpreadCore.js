const GC = require('@grapecity/spread-sheets');
require('@grapecity/spread-sheets-charts');
require('@grapecity/spread-sheets-print');
require('@grapecity/spread-sheets-barcode');
require('@grapecity/spread-sheets-shapes');
require('@grapecity/spread-sheets-pdf');
require('@grapecity/spread-sheets-slicers');
require('@grapecity/spread-sheets-pivot-addon');
require('@grapecity/spread-sheets-tablesheet');
const ExcelIO = require('@grapecity/spread-excelio');
require('@grapecity/spread-sheets-resources-ko');
require('@grapecity/spread-sheets-designer-resources-ko');
require('@grapecity/spread-sheets-designer');
GC.Spread.Common.CultureManager.culture('ko-kr');

/**
 * @param {String} spreadJsDesignLicense
 * @param {String} spreadJsLicense
 */
export const setSpreadLicense = async (
    spreadJsDesignLicense, spreadJsLicense) => {
  // Spread 16v TEST 용
  if (process.env.NODE_ENV != 'development') {
    GC.Spread.Sheets.LicenseKey = spreadJsLicense;
    ExcelIO.LicenseKey = spreadJsLicense;
    GC.Spread.Sheets.Designer.LicenseKey = spreadJsDesignLicense;
  }
};

// spread Core Objects
export const excelIO = new ExcelIO.IO();
export const sheets = GC.Spread.Sheets;

// eslint-disable-next-line prefer-const
export let designerRef;
export const setDesignerRef = (ref) => {
  designerRef = ref;
};

// eslint-disable-next-line prefer-const
export let workbookRef;
export const setWorkbookRef = (ref) => {
  workbookRef = ref;
};

// eslint-disable-next-line prefer-const
export let workbookJSONs = {};
export const initWorkkbookJSONs = () => {
  workbookJSONs = {};
};
export const insertWorkbookJSON = ({reportId, workbookJSON}) => {
  workbookJSONs[reportId] = workbookJSON;
};
export const deleteWorkbookJSON = (reportId) => {
  delete workbookJSONs[reportId];
};
export const getWorkbookJSON = (reportId) => {
  return workbookJSONs[reportId];
};
export const resetWorkbookJSON = ({reportId, workbookJSON}) => {
  workbookJSONs = {};
  workbookJSONs[reportId] = workbookJSON;
};

export const clearSheets = () => {
  if (designerRef?.current) {
    const workbook = designerRef.current.designer.getWorkbook();
    workbook.clearSheets();
    workbook.addSheet(0, new GC.Spread.Sheets.Worksheet('Sheet1'));
  }
};
