import DatasetType from 'components/dataset/utils/DatasetType';
import localizedString from 'config/localization';

export const excelFileType =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const defaultWorkbookJSON = {
  'version': '15.1.4',
  'sheets': [{
    'name': 'Sheet1',
    'rowCount': 100,
    'columnCount': 100
  }]
};

export const excelIOOpenOtions = {
  excelOpenFlags: {
    ignoreStyle: false,
    ignoreFormula: false,
    frozenColumnsAsRowHeaders: false,
    frozenRowsAsColumnHeaders: false,
    doNotRecalculateAfterLoad: true
  },
  password: '',
  /*
  * 0: normal : default
  * 1: lazy : 활성 시트만 로드
  * 2: incremental : UI and UI event could be refreshed and responsive directly.
  */
  openMode: 2,
  fullRecalc: true,
  dynamicReferences: false,
  incrementalCalculation: true,
  iterativeCalculation: true,
  iterativeCalculationMaximumIterations: 100
};

export const excelExportOptions = {
  includeBindingSource: true,
  fileType: 0
};

export const SpreadRibbonDefaultElement = {
  id: 'fileMenu',
  text: localizedString.file,
  visibleWhen: '!TableSheetActive&& !DataManagerActive ' +
   '&& !ContainMultipleHeaderCells || IsInTableSheetDesignMode',
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
            command: 'loadDataset',
            type: 'dropdown',
            children: Object.values(DatasetType)
                .filter((t) => t != DatasetType.CUBE)
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
            children: ['downloadReportXLSX'],
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
    }
  ]
};

export const spreadDownlaodReportModel = {
  templateName: 'downlaodReportDialog',
  title: '파일 다운로드',
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
