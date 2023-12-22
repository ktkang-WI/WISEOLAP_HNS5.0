import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import '@grapecity/spread-sheets-resources-ko';
import * as GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets-designer-resources-ko';
import {Designer} from '@grapecity/spread-sheets-designer-react';
import
'@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css';
import * as ExcelIO from '@grapecity/spread-excelio';
import '@grapecity/spread-sheets-designer';
import {forwardRef, useEffect, useRef, useState} from 'react';
GC.Spread.Common.CultureManager.culture('ko-kr');
// license keys
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
GC.Spread.Sheets.Designer.LicenseKey = 'intelligence.wise.co.kr,' +
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

const config = GC.Spread.Sheets.Designer.DefaultConfig;
const sheets = GC.Spread.Sheets;
const initRibbon = (spreadRef) => {
  console.log(config.commandMap);
  console.log(sheets);

  // add new tab
  const newTab = {
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
    ],
    visibleWhen: '!TableSheetActive && !DataManagerActive' +
    '&& !ContainMultipleHeaderCells || IsInTableSheetDesignMode'
  };
  delete config.fileMenu;
  config.ribbon.unshift(newTab);
  config.commandMap = {
    newReport: {
      title: '새로만들기',
      text: '새로만들기',
      iconClass: 'ribbon-button-new-report',
      bigButton: 'true',
      commandName: 'newReport',
      execute: function(context, propertyName, fontItalicChecked) {
        parent.gDashboard.reportUtility.newReport();
      }
    },
    openReportLocal: {
      title: '로컬 열기',
      text: '로컬 열기',
      iconClass: 'ribbon-button-open-report-local',
      bigButton: 'true',
      commandName: 'openReportLocal',
      execute: function(context, propertyName, fontItalicChecked) {
        GC.Spread.Sheets.Designer.getCommand('fileMenuPanel')
            .execute(context, 'button_import_excel', null);
      }
    },
    openReport: {
      title: '열기',
      text: '열기',
      iconClass: 'ribbon-button-open-report',
      bigButton: 'true',
      commandName: 'openReport',
      execute: function(context, propertyName, fontItalicChecked) {
        parent.gDashboard.reportUtility.openReport();
      }
    },
    saveReport: {
      title: '저장',
      text: '저장',
      iconClass: 'ribbon-button-save-report',
      bigButton: 'true',
      commandName: 'saveReport',
      execute: function(context, propertyName, fontItalicChecked) {
        parent.gDashboard.reportUtility.saveReport('true');
      }
    },
    saveAsReport: {
      title: '다른 이름으로 저장',
      text: '다른 이름으로 저장',
      iconClass: 'ribbon-button-save-as-report',
      bigButton: 'true',
      commandName: 'saveAsReport',
      execute: function(context, propertyName, fontItalicChecked) {
        parent.gDashboard.reportUtility.saveReport('false');
      }
    },
    deleteReport: {
      title: '보고서 삭제',
      text: '보고서 삭제',
      iconClass: 'ribbon-button-delete-report',
      bigButton: 'true',
      commandName: 'deleteReport',
      execute: function(context, propertyName, fontItalicChecked) {
        parent.gDashboard.reportUtility.deleteReport();
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
      execute: function(context, propertyName, fontItalicChecked) {
        const reportName = 'newReport';
        if (parent.gDashboard.structure.ReportMasterInfo != undefined) {
          reportName = parent.gDashboard.structure.ReportMasterInfo.name == '' ?
            'newReport': parent.gDashboard.structure
                .ReportMasterInfo.name.replace( /\s/gi, '_');
          reportName = reportName.replace(/\//g, '_');
          reportName = reportName.replace(/\\/g, '_');
        }
        GC.Spread.Sheets.Designer.showDialog('downlaodReportDialog',
            {extName: '.xlsx', fileName: reportName},
            function(e) {
              const fileName = e.fileName;
              if (fileName.substr(-5, 5) !== '.xlsx') {
                fileName += '.xlsx';
              }
              const json = JSON.stringify(workbook.toJSON(
                  {includeBindingSource: true}));
              excelIO.save(json, function(blob) {
                saveAs(blob, fileName);
              }, function(e) {
                console.log(e);
              });
            }
        );
      }
    },
    downloadReportTXT: {
      title: 'TXT',
      text: 'TXT',
      commandName: 'downloadReportTXT',
      execute: (context, propertyName, fontItalicChecked) => {
        const reportName = 'newReport';
        if (parent.gDashboard.structure.ReportMasterInfo != undefined) {
          reportName = parent.gDashboard.structure.ReportMasterInfo.name == '' ?
            'newReport' : parent.gDashboard.structure.
                ReportMasterInfo.name.replace( /\s/gi, '_');
          reportName = reportName.replace(/\//g, '_');
          reportName = reportName.replace(/\\/g, '_');
        }

        GC.Spread.Sheets.Designer.
            showDialog('downlaodReportDialog',
                {extName: '.txt', fileName: reportName},
                function(e) {
                  parent.gProgressbar.show();
                  setTimeout(function() {
                    parent.gDashboard.spreadsheetManager.
                        downlaodTxtServer(e.fileName);
                  }, 300);
                }
            );
      }
    },
    dataset: {
      title: '데이터집합 연동',
      text: '데이터집합 연동',
      iconClass: 'ribbon-button-dataset',
      bigButton: 'true',
      commandName: 'dataset',
      execute: function(context, propertyName, fontItalicChecked) {
        parent.connectDataset();
      }
    },
    print: {
      title: '프린트',
      text: '프린트',
      iconClass: 'ribbon-button-print',
      bigButton: 'true',
      commandName: 'print',
      execute: function(context, propertyName, fontItalicChecked) {
        parent.gDashboard.spreadsheetManager.printSpreadJS();
      }
    }
  };
  return config;
};

const SpreadBoard = ({}, ref) => {
  const spreadRef = useRef();
  const [designerHeight, setDesignerHeight] = useState();

  useEffect(() => {
    if (ref.current) return;
    setDesignerHeight(ref.current?.clientHeight);
    console.log(designerHeight);
  }, [ref?.current]);

  const config = initRibbon(spreadRef);
  const designerInitialized = (e) => {
    setTimeout(function() {
    }, 3000);
    spreadRef.spread = e.getWorkbook();
  };

  return (
    <Designer
      ref={spreadRef}
      styleInfo={{width: '100%', height: '100%'}}
      config={config}
      designerInitialized={designerInitialized}
    ></Designer>
  );
};

export default forwardRef(SpreadBoard);
