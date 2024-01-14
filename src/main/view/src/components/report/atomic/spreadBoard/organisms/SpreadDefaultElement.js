import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import {useDispatch} from 'react-redux';
import store from 'redux/modules';
import {selectCurrentReport,
  selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectCurrentDesigner, selectExcelIO, selectSheets}
  from 'redux/selector/SpreadSelector';
import {selectCurrentDatasets} from 'redux/selector/DatasetSelector';
import useReportSave from 'hooks/useReportSave';
import saveDefaultElement from
  'components/common/atomic/Ribbon/popover/organism/SaveDefaultElement';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import SpreadSlice from 'redux/modules/SpreadSlice';
import ribbonDefaultElement from
  'components/common/atomic/Ribbon/organism/Ribbon';
import LoadReportModal from 'components/report/organisms/Modal/LoadReportModal';
import DatasetLinkerModal from '../modal/DataLinkerModal';

const SpreadDefaultElement = () => {
  const {openModal, confirm, alert} = useModal();
  const {setDesigner} = SpreadSlice.actions;
  const dispatch = useDispatch();
  const {reload} = useReportSave();
  const {save} = saveDefaultElement();
  const ribbonElement = ribbonDefaultElement();

  const setRibbonSetting = () => {
    const sheets = selectSheets(store.getState());
    const config = sheets.Designer.DefaultConfig;
    // csutomtab 메뉴 생성
    if (config.commandMap) return config;
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

  // custom ribbon에 사용되는 메소드 정의 및 객체 반환.
  const ribbonCommandMap = () => {
    const newReport = (context) => {
      const sheets = selectSheets(store.getState());
      const selectedReportId = selectCurrentReportId(store.getState());
      const designer = selectCurrentDesignerMode;
      const executeNew = (context) => {
        const config = setRibbonSetting();
        reload(selectedReportId, designer);
        // 기존 workbook 제거
        context.destroy();
        // 새로운 workbook 생성 및 등록
        const newDesigner =
          new sheets.Designer.Designer(document
              .getElementById('spreadWrapper'), config);
        dispatch(setDesigner({
          reportId: selectedReportId,
          designer: newDesigner
        }));
      };

      confirm(localizedString.reloadConfirmMsg, () => executeNew(context));
    };

    const openReportLocal =(context) => {
      const sheets = selectSheets(store.getState());
      sheets.Designer.getCommand('fileMenuPanel')
          .execute(context, 'button_import_excel', null);
    };

    const openReport = () => {
      openModal(LoadReportModal);
    };

    const saveReport = () => {
      save[0].onClick();
    };

    const saveAsReport = () => {
      save[1].onClick();
    };

    const deleteReport = () => {
      ribbonElement['DeleteReport'].onClick();
    };

    const downloadReportXLSX = () => {
      let reportNm = selectCurrentReport(store.getState()).options.reportNm;
      const sheets = selectSheets(store.getState());
      const designer = selectCurrentDesigner(store.getState());
      const excelIO = selectExcelIO(store.getState());

      reportNm = reportNm.replaceAll(/[\s\/\\:*?"<>]/gi, '_');
      // 예외 처리 및  메소드 분리.
      sheets.Designer.showDialog('downlaodReportDialog',
          {
            extName: '.xlsx',
            fileName: reportNm,
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
        const fileName = e.fileName;
        const json = JSON.stringify(
            e.designer.getWorkbook().toJSON({includeBindingSource: true}));
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
      const datasets = selectCurrentDatasets(store.getState());
      if (datasets.length == 0) {
        alert(localizedString.dataSourceNotSelectedMsg);
        return;
      }
      openModal(DatasetLinkerModal);
    };

    const print = () => {
      const designer = selectCurrentDesigner(store.getState());
      const workbook = designer.getWorkbook();
      const activeSheet = workbook.getActiveSheet();
      activeSheet.printInfo().margin(
          {top: 10, bottom: 10, left: 10, right: 10, header: 10, footer: 10}
      );
      const index = workbook.getActiveSheetIndex();
      workbook.print(index);
    };

    return {
      newReport: {
        title: localizedString.newReport,
        text: localizedString.newReport,
        iconClass: 'ribbon-button-new-report',
        bigButton: 'true',
        commandName: 'newReport',
        execute: (context, propertyName, fontItalicChecked) => {
          newReport(context);
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
      downloadReportTXT: {
        title: 'TXT',
        text: 'TXT',
        commandName: 'downloadReportTXT',
        execute: (context, propertyName, fontItalicChecked) => {
          downloadReportTXT();
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
      },
      print: {
        title: localizedString.print,
        text: localizedString.print,
        iconClass: 'ribbon-button-print',
        bigButton: 'true',
        commandName: 'print',
        execute: (context, propertyName, fontItalicChecked) => {
          print();
        }
      }
    };
  };

  const downlaodReportModel = {
    templateName: 'downlaodReportDialog',
    title: '파일 저장',
    content: [{
      type: 'FlexContainer',
      children: [{
        type: 'TextBlock',
        margin: '0 0 0 10px',
        text: '파일 이름:'
      }, {
        type: 'ColumnSet',
        margin: '10px',
        children: [{
          type: 'Column',
          children: [{
            type: 'TextEditor',
            bindingPath: 'fileName',
            margin: '2px 2px 0 0'
          }],
          width: '200px'
        }, {
          type: 'Column',
          children: [{
            type: 'TextBlock',
            bindingPath: 'extName',
            style: 'line-height:30px'
          }],
          width: 'auto'
        }]
      }]
    }]
  };

  const SpreadRibbonDefaultElement = {
    id: 'fileMenu',
    text: localizedString.file,
    buttonGroups: [
      {
        commandGroup: {
          children: [
            {
              direction: 'vertical',
              commands: [
                'newReport'
              ]
            },
            {
              direction: 'vertical',
              commands: [
                'openReportLocal'
              ]
            },
            {
              direction: 'vertical',
              commands: [
                'openReport'
              ]
            },
            {
              direction: 'vertical',
              commands: [
                'saveReport'
              ]
            },
            {
              direction: 'vertical',
              commands: [
                'saveAsReport'
              ]
            },
            {
              direction: 'vertical',
              commands: [
                'deleteReport'
              ]
            },
            {
              direction: 'vertical',
              command: 'downloadReport',
              children: ['downloadReportXLSX', 'downloadReportTXT'],
              type: 'dropdown'
            }
          ]
        }
      },
      {
        commandGroup: {
          children: [
            {
              direction: 'vertical',
              commands: [
                'dataset'
              ]
            }
          ]
        }
      },
      {
        commandGroup: {
          children: [
            {
              direction: 'vertical',
              commands: [
                'print'
              ]
            }
          ]
        }
      }
    ]
  };

  return {setRibbonSetting};
};

export default SpreadDefaultElement;
