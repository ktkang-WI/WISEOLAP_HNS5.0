import {useDispatch} from 'react-redux';
import SpreadSlice from 'redux/modules/SpreadSlice';
import store from 'redux/modules';
import {
  selectCurrentSpreadJS,
  selectExcelIO,
  selectSheets
} from 'redux/selector/SpreadSelector';
import spreadDefaultElement from
  'components/report/atomic/spreadBoard/organisms/SpreadDefaultElement';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import useModal from './useModal';
import ReportFolderSelectorModal
  from 'components/report/modal/ReportFolderSelectorModal';
import ReportSaveForm
  from 'components/report/atomic/Save/molecules/ReportSaveForm';

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

export const useSpread = () => {
  const dispatch = useDispatch();
  const spreadSlice = SpreadSlice.actions;
  const {openModal, confirm, alert} = useModal();

  const setSpreadJSConfig = () => {
    dispatch(spreadSlice.setLibrariesObject({
      Sheets: GC.Spread.Sheets,
      excelIO: excelIO
    }));
  };

  // Ribbon Custom
  const setRibbonSetting = () => {
    const {SpreadRibbonDefaultElement, ribbonCommandMap, downlaodReportModel} =
      spreadDefaultElement();
    const config = GC.Spread.Sheets.Designer.DefaultConfig;
    // csutomtab 메뉴 생성
    const newTab = SpreadRibbonDefaultElement;

    // 불필요 메뉴 삭제
    delete config.fileMenu;
    config.ribbon.unshift(newTab);

    // customtab 메뉴 메소드 정의
    const commandMap = ribbonCommandMap();
    // ribbon download modal 정의
    const downlaodReportDialog = downlaodReportModel;
    // Template 기능 추가.
    addSpreadTemplate('downlaodReportDialog', downlaodReportDialog);
    config.commandMap = commandMap;
    return config;
  };

  const addSpreadTemplate = (templateName, templateMethod) => {
    GC.Spread.Sheets.Designer.registerTemplate(templateName, templateMethod);
  };

  const newReport = () => {
    confirm('test', () => {
      console.log('test');
    });
  };

  const openReportLocal =(context) => {
    const sheets = selectSheets(store.getState());
    sheets.Designer.getCommand('fileMenuPanel')
        .execute(context, 'button_import_excel', null);
  };

  const openReport = () => {
    openModal(ReportFolderSelectorModal);
  };

  const saveReport = () => {

  };

  const saveAsReport = () => {
    openModal(ReportSaveForm);
  };

  const deleteReport = () => {

  };

  const downloadReportXLSX = () => {
    let reportNm = selectCurrentReport(store.getState()).options.reportNm;
    const sheets = selectSheets(store.getState());
    const spreadJS = selectCurrentSpreadJS(store.getState());
    const excelIO = selectExcelIO(store.getState());

    reportNm = reportNm.replaceAll(/[\s\/\\:*?"<>]/gi, '_');
    // 예외 처리 및  메소드 분리.
    sheets.Designer.showDialog('downlaodReportDialog',
        {
          extName: '.xlsx',
          fileName: reportNm,
          spreadJS: spreadJS,
          excelIO: excelIO
        },
        xlsxDownload
    );
  };

  const xlsxDownload = (e) => {
    if (e.fileName === '') {
      alert('파일명을 입력해 주세요.');
    } else {
      if (e.fileName
          .substr(-e.extName.length, e.extName.length) !== e.extName) {
        e.fileName += e.extName;
      }
      const fileName = e.fileName;
      const json = JSON.stringify(
          e.spreadJS.toJSON({includeBindingSource: true}));
      e.excelIO.save(json, (blob) => {
        saveAs(blob, fileName);
      }, (e) => {
        console.log(e);
      });
    }
  };

  const downloadReportTXT = () => {

  };

  const dataset = () => {

  };

  const print = () => {
    const spreadJS = selectCurrentSpreadJS(store.getState());
    const activeSheet = spreadJS.getActiveSheet();
    activeSheet.printInfo().margin(
        {top: 10, bottom: 10, left: 10, right: 10, header: 10, footer: 10}
    );
    const index = spreadJS.getActiveSheetIndex();
    spreadJS.print(index);
  };

  return {
    setSpreadJSConfig,
    setRibbonSetting,
    newReport,
    openReportLocal,
    openReport,
    saveReport,
    saveAsReport,
    deleteReport,
    downloadReportXLSX,
    downloadReportTXT,
    dataset,
    print
  };
};

export default useSpread;
