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
export const setSpreadLicense = (
    spreadJsDesignLicense, spreadJsLicense) => {
  // Spread 16v TEST 용
  spreadJsDesignLicense = 'intelligence.wise.co.kr,E667286354186462#B1t4DnZ' +
  '6T6tCbZdlVLhkch3EcNZkSwQmeY3EWVNFUxZHNxRGe8gEOwMndr9ES9BVY4FVcYVESFtiV0BH' +
  'MudmdwhVUBRDOwdHZoBlZvg7VmlXMvxmRYFUOVZ6VzhncqNnTsRUb4JFRvUnQNB5T4F4Slhkey' +
  'Y4KhtiR8d5LsplcnFTSO3CT8IGMvZFSsl6V7dFW8pmbJVFUyM7Z7plcwYVNxMHT43SdDBzSnRD' +
  'WkFTcityZ7VTOnhXbM3iS8FnePZVNJh5bKVHdXtURvZlbsRzbKpVY9wEVMNzbGdmMiZmMsxURn' +
  'ZVNolUcEhzK0d7YHd4NZZ6RO9WeZNGZsxEO0JzdJNmNVxmZvR5V9cTaEp7RwxWWiojITJCLiUE' +
  'N6ITOGhjI0ICSiwCNzMTO5UTOxAjM0IicfJye&Qf35Vfi4EU9cjI0IyQiwiI6EjL6BibvRGZB5i'+
  'cl96ZpNXZE5yUKRWYlJHcTJiOi8kI1tlOiQmcQJCLicDNzMzNwASMyMDM4IDMyIiOiQncDJCLi' +
  'kTM6ADNyAjMiojIwhXRiwiIytmLvNmLlNXa79SZj9WZnlGbsVGdulmI0IyctRkIsISjF6OtdyOh'+
  'VyOuEyOhcyuI0ISYONkIsUWdyRnOiwmdFJCLiIjN4YDOxQTNzYDOycjN6IiOiQWSiwSfdJSZsJ' +
  'WYUR7b6lGUislOicGbmJCLlNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPRR5NihVWz3CcKty'+
  'V4okdKhkT6pEUulzaERUMYB5S8lHMs5UZ6RDRysGWZBlZyYHTyV6LWhnZa36MtlnRKlFUyBn'+
  'Qwumqv';
  spreadJsLicense = 'intelligence.wise.co.kr,E435423422424783#B1lL6VFWv4UeKV'+
  'zVzFTaQl5VrEHaQ56KZdmc4V5TsN7ZB5WM9V4cmFVUzlla4BTMa94Mn9kNrtyK4cXUy2GRXxWRG'+
  'hnUtp6RldlZZNzUZN4L4lmQ83kWvZWWJdza4NzLhlTOldmdJdTSQpXexdkZFZmQ5VlZ6ZXbzV'+
  '7LwMHeOtiQadjW53STwoXbYhVaV3CM5UHZFpUUpZmNVZXN9AjRuV5NlZWVoJFdE3SWINXZKdz'+
  'LzsWVS36dNFXQEV5Sr9kQ5JVWjh4VEp7K9UjUpRUeUVzV6Y6arlnWElnM4Qza7knVQF5TvN6b'+
  'RpFSWt6ap3WZlhHSWN7Vy5UO5RkQuJTUVp6QN3CTyNTbrdUSiojITJCLiYjRxAzNFVkI0ICSi'+
  'wSN7QTMwkDO5QTM0IicfJye#4Xfd5nIXR5QaJiOiMkIsIiNx8idgMlSgQWYlJHcTJiOi8kI1'+
  'tlOiQmcQJCLicTMzMzNwASMyMDM4IDMyIiOiQncDJCLikTM6ADNyAjMiojIwhXRiwiIytmLvN'+
  'mLlNXa79SZj9WZnlGbsVGdulmI0IyctRkIsISjF6OtdyOhVyOuEyOhcyuI0ISYONkIsUWdyRn'+
  'OiwmdFJCLiMDO7QjM4IjM4MjM4UzM4IiOiQWSiwSfdJSZsJWYUR7b6lGUislOicGbmJCLlNH'+
  'bhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPRhTNTVDTG9GZuREcDpnaydWSsh5V4cGRiFzRxME'+
  'UrYUb7JFMjhWWElEVO3UY7UVcqtUV4IWM4NHaLxkWwB7NWZGMQNzVD3WOxM1RJl';
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

