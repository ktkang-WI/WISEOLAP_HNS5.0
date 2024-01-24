import {createSlice} from '@reduxjs/toolkit';
require('@grapecity/spread-sheets-designer/' +
  'styles/gc.spread.sheets.designer.min.css');
require('@grapecity/spread-sheets-designer-resources-ko');
require('@grapecity/spread-sheets-resources-ko');
require('@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css');
require('@grapecity/spread-sheets-designer');

const GC = require('@grapecity/spread-sheets');
const ExcelIO = require('@grapecity/spread-excelio');

GC.Spread.Common.CultureManager.culture('ko-kr');
const sjsLicense = 'intelligence.wise.co.kr,5962557' +
'29596446#B0DTH7Z7MJ9GdpVTNwhFcolnU8V4M8ZXVCxUVZFTdB' +
'RVVpljSnlFT6VWa8tUQWFGVxljTtl6Vw5UWiJle9I6T5h5M8w6N8' +
'YmSV56Mth5U6lWNThjcURHNmp7NstCZ4ond5cUT7smNTpWWzIlTxJ' +
'nYiljcmNlYxZ6bWVFajBzVsVFavNnd6FFUl3GVwxUSPJXNFNGU0h5' +
'LQtCRPd4dBVUWPBjR9NHd8BnMwtCUv2meuFkcHZEMmF5QGVTVXlzND' +
'dWS6IlazJ7THhTbttUW9ADWx34cvZWTjJDNkV4UnNmZ4QmewgVMtln' +
'ZyBFTr54RCdWZHZjcxdTaaBncO3mWiojITJCLiEUOGBTQChjMiojII' +
'JCL5ITO9MjM4AjN0IicfJye&Qf35VfiwUQRNlI0IyQiwiI5EjL6ByUK' +
'BCZhVmcwNlI0IiTis7W0ICZyBlIsIiM5IjM5ADI5IDMxIjMwIjI0ICd' +
'yNkIsIicr9ybj9SZzl6duU6YuV6ZpxGblRnbpJiOiMXbEJCLi4YhtT' +
'bnsTYlsjLhsTInsLiOiEmTDJCLiYDN4YTO5kjM7UTNyYTO5IiOiQWSi' +
'wSfdJSZsJWYUR7b6lGUislOicGbmJCLlNHbhZmOiI7ckJye0ICbuFkI1' +
'pjIEJCLi4TP7NFZh3UZ4YHO9NGe9EUewNnQKVTQVNUMv3ybFtEZ7wEW9Q' +
'6bH3EVEl5TLRjNuNVT9FGWNVEULJEaxdmT4RTMPZXdmV7TPZFW6FmandUV' +
'OllSQV5djxUNxqVCV';
GC.Spread.Sheets.LicenseKey = sjsLicense;
ExcelIO.LicenseKey = sjsLicense;
GC.Spread.Sheets.Designer.LicenseKey ='intelligence.wise.co.kr,' +
'431752997214611#B0u6VWVlWMPV5UxF5ZZRmRT3yYJhGcwxWNVZGNENVW4VXYW' +
'J7TxdETMJzShRFbLp6KQ5ET944RFJUcqhUaRZ6SvlVbB3WbrRkbPdHVhhXeplTM' +
'KZXTMdFRmJ4bVp5LX3UMktUT98GRX36Q6MWW4Ana9cWYrAja9wUYZV4cuB7L7QX' +
'OmpUaPJ4bzB5V92CUwYGZVJFarNnNllUZ6MnSvkUWGV5bjh4QEFGZ4QVS9AHd9o' +
'VYrFTe6YVRvU4KwR4KjFlQJ9kSZV5LxpWaQhVNwtSQU36Szg6aTl7L7l6LVJGaB' +
'B5dFVnV5hHe63EcQR7ThlmZ6J7ZFJXMxADcDZlZUpWMFB7SiojITJCLiMDNCVjQB' +
'lzMiojIIJCL6ITO9QDOzETN0IicfJye35XX3JSS42UUiojIDJCLiUTMuYHIu3GZkF' +
'ULyVmbnl6clRULTpEZhVmcwNlI0IiTis7W0ICZyBlIsISM4YjM8ADI6ETMxIjMwI' +
'jI0ICdyNkIsIicr9ybj9SZzl6duU6YuV6ZpxGblRnbpJiOiMXbEJCLi4YhtTbnsT' +
'YlsjLhsTInsLiOiEmTDJCLiETM6QTMycTO9ITN7EzM4IiOiQWSiwSfdJSZsJWYU' +
'R7b6lGUislOicGbmJCLlNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TP73GUydVd9l4' +
'ZwkXczA5QwU6VyBlS6JzLlNmMyRHOyQEOilVMYRUOnJnZh3yZS5mSKB7UlNXNilTTX' +
'lWORRkYOZWTNpEUQ34YolDNFVlero4c1RiV';
const excelIO = new GC.Spread.Excel.IO();

const defaultBindInfo = {
  rowIndex: 0,
  columnIndex: 0,
  useHeader: false,
  useBorder: false,
  useBind: false,
  sheetNm: undefined,
  datasetNm: undefined
};

const initialState = {
  sheets: GC.Spread.Sheets,
  excelIO: excelIO,
  // SpreadDefaultElement - createDesigner 메소드에서 생성
  // SpreadDefaultElement에서 생성하는 Hook을 만들 경우 Hook이 순환참조되어 임시 state로 저장
  config: undefined,
  // Workbook의 instance 객체 새롭게 만들어서 관리되야함.
  0: {
    designer: undefined,
    bindingInfos: {}
  }
};

const reducers = {
  initSpread: () => initialState,
  setSpread(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId] = {};
    state[reportId].bindingInfos = actions.payload.bindingInfos;
    state[reportId].reportId = reportId;
    state[reportId].designer = actions.payload.designer;
  },
  setBindingInfos(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId].bindingInfos = actions.payload.bindingInfos;
  },
  setBindingInfo(state, actions) {
    const reportId = actions.payload.reportId;
    const datasetId = actions.payload.datasetId;
    const keys1 = Object.keys(actions.payload.bindingInfo).sort();
    const keys2 = Object.keys(defaultBindInfo).sort();
    if (keys1.length === keys2.length &&
        keys1.every((key, index) => key === keys2[index])) {
      new Error('setBindingInfo의 bindingInfo의 key가 다릅니다.');
    }
    state[reportId].bindingInfos[datasetId] = actions.payload.bindingInfo;
  },
  deleteSpread(state, actions) {
    if (actions.payload == 0) {
      return initialState;
    } else {
      delete state[actions.payload];
    }
  },
  changeSpreadReportId(state, actions) {
    const prevId = actions.payload.prevId;
    const newId = actions.payload.newId;

    if (prevId != newId) {
      const spread = state[prevId];
      delete state[prevId];
      state[newId] = spread;
    }
  }
};

const extraReducers = (builder) => {
  builder.addDefaultCase((state) => {
    state.defaultBindInfo = defaultBindInfo;
  });
};

const SpreadSlice = createSlice({
  name: 'Spread',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default SpreadSlice;
