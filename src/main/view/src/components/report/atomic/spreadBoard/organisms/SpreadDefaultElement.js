import useSpread from 'hooks/useSpread';

const SpreadDefaultElement = () => {
  const SpreadRibbonDefaultElement = {
    id: 'fileMenu',
    text: '파일',
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

  const ribbonCommandMap = () => {
    const {
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
    } = useSpread();

    return {
      newReport: {
        title: '새로만들기',
        text: '새로만들기',
        iconClass: 'ribbon-button-new-report',
        bigButton: 'true',
        commandName: 'newReport',
        execute: (context, propertyName, fontItalicChecked) => {
          newReport();
        }
      },
      openReportLocal: {
        title: '로컬 열기',
        text: '로컬 열기',
        iconClass: 'ribbon-button-open-report-local',
        bigButton: 'true',
        commandName: 'openReportLocal',
        execute: (context, propertyName, fontItalicChecked) => {
          openReportLocal(context);
        }
      },
      openReport: {
        title: '열기',
        text: '열기',
        iconClass: 'ribbon-button-open-report',
        bigButton: 'true',
        commandName: 'openReport',
        execute: (context, propertyName, fontItalicChecked) => {
          openReport();
        }
      },
      saveReport: {
        title: '저장',
        text: '저장',
        iconClass: 'ribbon-button-save-report',
        bigButton: 'true',
        commandName: 'saveReport',
        execute: (context, propertyName, fontItalicChecked) => {
          saveReport();
        }
      },
      saveAsReport: {
        title: '다른 이름으로 저장',
        text: '다른 이름으로 저장',
        iconClass: 'ribbon-button-save-as-report',
        bigButton: 'true',
        commandName: 'saveAsReport',
        execute: (context, propertyName, fontItalicChecked) => {
          saveAsReport();
        }
      },
      deleteReport: {
        title: '보고서 삭제',
        text: '보고서 삭제',
        iconClass: 'ribbon-button-delete-report',
        bigButton: 'true',
        commandName: 'deleteReport',
        execute: (context, propertyName, fontItalicChecked) => {
          deleteReport();
        }
      },
      downloadReport: {
        title: '다운로드',
        text: '다운로드',
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
        title: '데이터집합 연동',
        text: '데이터집합 연동',
        iconClass: 'ribbon-button-dataset',
        bigButton: 'true',
        commandName: 'dataset',
        execute: (context, propertyName, fontItalicChecked) => {
          dataset();
        }
      },
      print: {
        title: '프린트',
        text: '프린트',
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
  return {SpreadRibbonDefaultElement, ribbonCommandMap, downlaodReportModel};
};

export default SpreadDefaultElement;
