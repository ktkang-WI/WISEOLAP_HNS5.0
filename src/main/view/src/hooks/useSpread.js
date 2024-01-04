import store from 'redux/modules';
import {
  selectCurrentWorkbook,
  selectExcelIO,
  selectSheets
} from 'redux/selector/SpreadSelector';
import {selectCurrentReport,
  selectCurrentReportId} from 'redux/selector/ReportSelector';
import useModal from './useModal';
import ReportFolderSelectorModal
  from 'components/report/modal/ReportFolderSelectorModal';
import ReportSaveForm
  from 'components/report/atomic/Save/molecules/ReportSaveForm';
import DatasetLinkerModal
  from 'components/report/atomic/spreadBoard/modal/DatasetLinkerModal';
import {useDispatch} from 'react-redux';
import SpreadSlice from 'redux/modules/SpreadSlice';
import useSpreadConfig from
  'components/report/atomic/spreadBoard/useSpreadConfig';

export default function useSpread() {
  const {openModal, confirm, alert} = useModal();
  const {setRibbonSetting} = useSpreadConfig();
  const config = setRibbonSetting();
  const dispatch = useDispatch();
  const spreadSlice = SpreadSlice.actions;

  const newReport = (context) => {
    const sheets = selectSheets(store.getState());
    const selectedReportId = selectCurrentReportId(store.getState());
    const executeNew = (context) => {
      const newWorkbook =
        new sheets.Designer.Designer(document.getElementById('test'), config);
      context.destroy();
      dispatch(spreadSlice.setWorkbook({
        reportId: selectedReportId,
        workbook: newWorkbook
      }));
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
    const workbook = selectCurrentWorkbook(store.getState());
    const excelIO = selectExcelIO(store.getState());

    reportNm = reportNm.replaceAll(/[\s\/\\:*?"<>]/gi, '_');
    // 예외 처리 및  메소드 분리.
    sheets.Designer.showDialog('downlaodReportDialog',
        {
          extName: '.xlsx',
          fileName: reportNm,
          workbook: workbook,
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
          e.workbook.toJSON({includeBindingSource: true}));
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
    const workbook = selectCurrentWorkbook(store.getState());
    const activeSheet = workbook.getActiveSheet();
    activeSheet.printInfo().margin(
        {top: 10, bottom: 10, left: 10, right: 10, header: 10, footer: 10}
    );
    const index = workbook.getActiveSheetIndex();
    workbook.print(index);
  };

  return {
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

