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
import DatasetLinkerModal
  from 'components/report/atomic/spreadBoard/modal/DatasetLinkerModal';

export const useSpread = () => {
  const {openModal, confirm, alert} = useModal();

  // Ribbon Custom
  const setRibbonSetting = () => {
    const sheets = selectSheets(store.getState());
    const {SpreadRibbonDefaultElement, ribbonCommandMap, downlaodReportModel} =
      spreadDefaultElement();
    const config = sheets.Designer.DefaultConfig;
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
    const sheets = selectSheets(store.getState());
    sheets.Designer.registerTemplate(templateName, templateMethod);
  };

  const newReport = (context) => {
    const executeNew = (context) => {
      const sheets = selectSheets(store.getState());
      context.destroy();
      new sheets.Designer.Designer(
          document.getElementsByClassName('ss')[0], config);
    };

    confirm('test', () => executeNew(context));
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

  const datasetBinder = () => {
    openModal(DatasetLinkerModal);
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
    setRibbonSetting,
    newReport,
    openReportLocal,
    openReport,
    saveReport,
    saveAsReport,
    deleteReport,
    downloadReportXLSX,
    downloadReportTXT,
    datasetBinder,
    print
  };
};

export default useSpread;
