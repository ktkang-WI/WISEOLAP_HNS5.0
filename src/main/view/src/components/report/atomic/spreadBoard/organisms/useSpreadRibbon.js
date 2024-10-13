import localizedString from 'config/localization';
import store from 'redux/modules';
import useModal from 'hooks/useModal';
import useReportSave from 'hooks/useReportSave';
import saveDefaultElement
  from 'components/common/atomic/Ribbon/popover/organism/SaveDefaultElement';
import ribbonDefaultElement
  from 'components/common/atomic/Ribbon/organism/RibbonDefaultElement';
import LoadReportModal from 'components/report/organisms/Modal/LoadReportModal';
import useSpread from 'hooks/useSpread';
import {selectCurrentReport, selectCurrentReportId}
  from 'redux/selector/ReportSelector';
import useFile from 'hooks/useFile';
import DatasetLinkerModal from '../modal/DataLinkerModal';
import {selectCurrentDesignerMode}
  from 'redux/selector/ConfigSelector';
import {
  sheets,
  excelIO,
  resetWorkbookJSON,
  designerRef,
  clearSheets
} from '../util/SpreadCore';
import {
  SpreadRibbonDefaultElement,
  defaultWorkbookJSON,
  spreadDownlaodReportModel
} from 'components/report/atomic/spreadBoard/util/spreadContants.js';
import DatasetType from 'components/dataset/utils/DatasetType';
import {selectCurrentDatasets} from 'redux/selector/DatasetSelector';
import datasetDefaultElement
  from 'components/common/atomic/Ribbon/popover/organism/DatasetDefaultElement';

const useSpreadRibbon = () => {
  const {openModal, alert, confirm} = useModal();
  const {reload} = useReportSave();
  const {uploadFile, deleteFile, uploadsjs} = useFile();
  const {getElementByLable} = saveDefaultElement();
  const ribbonElement = ribbonDefaultElement();
  const {getDatasetElement} = datasetDefaultElement();
  const {
    createReportBlob
  } = useSpread();

  const setRibbonSetting = () => {
    const config = sheets.Designer.DefaultConfig;
    const newTab = SpreadRibbonDefaultElement;
    // 불필요 메뉴 삭제
    delete config.fileMenu;
    config.ribbon = config.ribbon.filter(({id}) => id != 'fileMenu');
    config.ribbon.unshift(newTab);
    // customtab 메뉴 메소드 정의
    const commandMap = ribbonCommandMap();
    // ribbon download modal 정의
    const downlaodReportDialog = spreadDownlaodReportModel;
    // Template 기능 추가.
    addSpreadTemplate('downlaodReportDialog', downlaodReportDialog);
    config.commandMap = commandMap;
    return config;
  };

  const setRibbonRemoveFileMenu = () => {
    const config = sheets.Designer.DefaultConfig;
    // 불필요 메뉴 삭제
    delete config.fileMenu;
    return config;
  };

  // spread ribbon menu 선언 부분
  const newReport = (context) => {
    const designerMode = selectCurrentDesignerMode(store.getState());
    context.getWorkbook().fromJSON(defaultWorkbookJSON);
    reload(designerMode);
  };

  const openReportLocal = (context) => {
    const currentReportId = selectCurrentReportId(store.getState());

    if (process.env.NODE_ENV == 'development') {
      // 기존 파일 불러오기
      sheets.Designer.getCommand('fileMenuPanel')
          .execute(context, 'button_import_excel', null);
    } else {
      // 홈앤쇼핑 커스터마이징 (DRM 파일 복호화 기능 추가)
      const fileInput = document.getElementById('fileInput');
      fileInput.click();
    }

    resetWorkbookJSON({
      reportId: currentReportId,
      workbookJSON: context.getWorkbook().toJSON()
    });
  };

  const openReport = () => {
    openModal(LoadReportModal);
  };

  const createExcelFile = (reportId) => {
    createReportBlob().then(
        (blob) => uploadFile(
            blob,
            {fileName: reportId + '.sjs'}
        )).catch((e) => {
      console.log(e);
    });
  };

  const downloadExcelFile = (fileName) => {
    createReportBlob().then(
        (blob) => uploadsjs(
            blob,
            {fileName: fileName + '.sjs'}
        )).catch((e) => {
      console.log(e);
    });
  };
  const saveReport = () => {
    getElementByLable(localizedString.saveReport)
        .onClick({createExcelFile: createExcelFile});
  };

  const saveAsReport = () => {
    getElementByLable(localizedString.saveAs)
        .onClick({createExcelFile: createExcelFile});
  };
  const deleteReport = () => {
    ribbonElement['DeleteReport'].onClick({deleteExcelFile: deleteExcelFile});
  };

  const deleteExcelFile = ({reportId, prevDesigner}) => {
    deleteFile({fileName: reportId + '.sjs'});
    clearSheets();
  };

  const downloadReportXLSX = () => {
    let reportNm = selectCurrentReport(store.getState()).options.reportNm;
    const currentReportId = selectCurrentReportId(store.getState());
    const designer = designerRef.current.designer;
    reportNm = reportNm.replaceAll(/[\s\/\\:*?'<>]/gi, '_');
    sheets.Designer.showDialog('downlaodReportDialog',
        {
          extName: '.xlsx',
          fileName: reportNm,
          reportId: currentReportId,
          designer: designer,
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
      // const fileName = e.fileName;
      const fileName = e.reportId;
      // 다운로드 방식 변경
      /*
      e.designer.getWorkbook().export((blob) => {
        saveAs(blob, fileName);
      }, () => {
        alert(localizedString.reportCorrupted);
      }, {includeBindingSource: true, fileType: 0});
      */
      downloadExcelFile(fileName);
    }
  };

  const datasetBinder = () => {
    const datasets = selectCurrentDatasets(store.getState());
    if (datasets.length == 0) {
      alert(localizedString.dataSourceNotSelectedMsg);
      return;
    }
    openModal(DatasetLinkerModal);
  };

  // const print = () => {
  //   const workbook = designer.getWorkbook();
  //   const activeSheet = workbook.getActiveSheet();
  //   activeSheet.printInfo().margin(
  //       {top: 10, bottom: 10, left: 10, right: 10, header: 10, footer: 10}
  //   );
  //   const index = workbook.getActiveSheetIndex();
  //   workbook.print(index);
  // };

  const addSpreadTemplate = (templateName, templateMethod) => {
    sheets.Designer.registerTemplate(templateName, templateMethod);
  };

  // custom ribbon에 사용되는 메소드 정의 및 객체 반환.
  const ribbonCommandMap = () => {
    const datasetCommands = getDatasetElement().dataset.reduce(
        (acc, {id, label, onClick}) => {
          if (id == DatasetType.CUBE) return acc;

          acc[id] = {
            title: label,
            text: label,
            commandName: id,
            execute: onClick
          };

          return acc;
        }, {});

    return {
      ...datasetCommands,
      newReport: {
        title: localizedString.newReport,
        text: localizedString.newReport,
        iconClass: 'ribbon-button-new-report',
        bigButton: 'true',
        commandName: 'newReport',
        execute: (context, propertyName, fontItalicChecked) => {
          confirm(localizedString.reloadConfirmMsg, () => {
            newReport(context);
          });
        }
      },
      openReportLocal: {
        title: localizedString.importFileFromPC,
        text: localizedString.importFileFromPC,
        iconClass: 'ribbon-button-open-report-local',
        bigButton: 'true',
        commandName: 'openReportLocal',
        execute: (context, propertyName, fontItalicChecked) => {
          openReportLocal(context);
        }
      },
      openReport: {
        title: localizedString.loadReport,
        text: localizedString.loadReport,
        iconClass: 'ribbon-button-open-report',
        bigButton: 'true',
        commandName: 'openReport',
        execute: (context, propertyName, fontItalicChecked) => {
          openReport();
        }
      },
      loadDataset: {
        title: localizedString.dataset,
        text: localizedString.dataset,
        iconClass: 'ribbon-button-load-dataset',
        bigButton: 'true',
        commandName: 'loadDataset'
      },
      saveReport: {
        title: localizedString.saveReport,
        text: localizedString.saveReport,
        iconClass: 'ribbon-button-save-report',
        bigButton: 'true',
        commandName: 'saveReport',
        execute: (context, propertyName, fontItalicChecked) => {
          saveReport();
        }
      },
      saveAsReport: {
        title: localizedString.saveAs,
        text: localizedString.saveAs,
        iconClass: 'ribbon-button-save-as-report',
        bigButton: 'true',
        commandName: 'saveAsReport',
        execute: (context, propertyName, fontItalicChecked) => {
          saveAsReport();
        }
      },
      deleteReport: {
        title: localizedString.deleteReport,
        text: localizedString.deleteReport,
        iconClass: 'ribbon-button-delete-report',
        bigButton: 'true',
        commandName: 'deleteReport',
        execute: (context, propertyName, fontItalicChecked) => {
          deleteReport();
        }
      },
      downloadReport: {
        title: localizedString.downloadReport,
        text: localizedString.downloadReport,
        iconClass: 'ribbon-button-download-report',
        bigButton: 'true',
        commandName: 'downloadReport'
      },
      downloadReportXLSX: {
        title: 'XLSX',
        text: 'XLSX',
        commandName: 'downloadReportXLSX',
        execute: (context, propertyName, fontItalicChecked) => {
          downloadReportXLSX();
        }
      },
      dataset: {
        title: localizedString.datasetBinding,
        text: localizedString.datasetBinding,
        iconClass: 'ribbon-button-dataset',
        bigButton: 'true',
        commandName: 'dataset',
        execute: (context, propertyName, fontItalicChecked) => {
          datasetBinder();
        }
      }
    };
  };

  return {setRibbonSetting, setRibbonRemoveFileMenu};
};

export default useSpreadRibbon;
