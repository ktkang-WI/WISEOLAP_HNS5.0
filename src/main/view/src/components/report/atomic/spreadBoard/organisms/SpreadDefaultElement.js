import localizedString from 'config/localization';
import store from 'redux/modules';
import {selectSheets}
  from 'redux/selector/SpreadSelector';
import useSpread from 'hooks/useSpread';
import useModal from 'hooks/useModal';

const SpreadDefaultElement = () => {
  const {
    executeNew,
    openReportLocal,
    openReport,
    saveReport,
    saveAsReport,
    deleteReport,
    downloadReportXLSX,
    downloadReportTXT,
    datasetBinder,
    print,
    addSpreadTemplate
  } = useSpread();
  const {confirm} = useModal();

  // config의 경우 초기에만 생성하고 이후에 state에서 사용하는 형태로 변경
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

  // custom ribbon에 사용되는 메소드 정의 및 객체 반환.
  const ribbonCommandMap = () => {
    return {
      newReport: {
        title: localizedString.newReport,
        text: localizedString.newReport,
        iconClass: 'ribbon-button-new-report',
        bigButton: 'true',
        commandName: 'newReport',
        execute: (context, propertyName, fontItalicChecked) => {
          confirm(localizedString.reloadConfirmMsg, () => executeNew(context));
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

  return {
    setRibbonSetting
  };
};

export default SpreadDefaultElement;
