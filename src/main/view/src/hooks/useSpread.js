import {
  createColumnsAndRows,
  dataSourceMaker,
  deleteTables,
  generateColumns,
  createBorderStyle
}
  from 'components/report/atomic/spreadBoard/util/spreadUtil';
import {useDispatch, useSelector} from 'react-redux';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectBindingInfos} from 'redux/selector/SpreadSelector';
import {excelIO, sheets, insertWorkbookJSON, designerRef, workbookRef}
  from 'components/report/atomic/spreadBoard/util/SpreadCore';
import {defaultWorkbookJSON, excelFileType, excelIOOpenOtions}
  from 'components/report/atomic/spreadBoard/util/spreadContants';
import useFile from './useFile';
import {selectEditMode} from 'redux/selector/ConfigSelector';
import {EditMode} from 'components/config/configType';
import store from 'redux/modules';

const useSpread = () => {
  const dispatch = useDispatch();
  const {setBindingInfo} = SpreadSlice.actions;
  const bindingInfos = useSelector(selectBindingInfos);
  const reportId = useSelector(selectCurrentReportId);
  const {importFile} = useFile();

  const getWorkbook = () => {
    const editMode = selectEditMode(store.getState());
    if (editMode === EditMode['DESIGNER']) {
      return designerRef.current.designer.getWorkbook();
    } else if (editMode === EditMode['VIEWER']) {
      return workbookRef.current.spread;
    }
  };

  const bindData = ({rowData, bindingInfo}) => {
    if (rowData.length === 0) return;
    const workbook = getWorkbook();
    const {columns} = generateColumns(rowData, sheets);
    let bindedSheet = workbook
        .getSheetFromName(bindingInfo.sheetNm);

    if (bindedSheet == undefined) {
      workbook.addSheet(0,
          new sheets.Worksheet(bindingInfo.sheetNm));
      bindedSheet = workbook
          .getSheetFromName(bindingInfo.sheetNm);
    }

    const {invoice, dataSource} = dataSourceMaker(rowData, sheets);
    createColumnsAndRows(columns, invoice, bindedSheet, bindingInfo);
    deleteTables(bindedSheet);

    workbook.suspendPaint();

    const table = bindedSheet.tables.add('table'+ bindingInfo.sheetNm,
        bindingInfo.rowIndex,
        bindingInfo.columnIndex,
        invoice.records.length+1,
        columns.length,
        createBorderStyle(bindingInfo.useBorder));

    table.showHeader(bindingInfo.useHeader);
    table.autoGenerateColumns(false);
    table.bindColumns(columns);
    table.bindingPath('records');
    table.bandRows(false);
    table.bandColumns(false);
    bindedSheet.options.gridline.showHorizontalGridline = true;
    bindedSheet.options.gridline.showVerticalGridline = true;
    bindedSheet.invalidateLayout();

    bindedSheet.setDataSource(dataSource);
    table.filterButtonVisible(false);

    workbook.resumePaint();
  };


  const sheetChangedListener = (designer) => {
    designer.getWorkbook().bind(sheets.Events.SheetChanged, changSheet);
  };

  const changSheet = (e, args) => {
    if (args.propertyName === 'deleteSheet') {
      deletedSheet(e, args);
    }
  };

  const deletedSheet = (e, args) => {
    const datasetNms = Object.keys(bindingInfos);
    if (!_.isEmpty(bindingInfos)) return null;
    datasetNms.map((datasetId) => {
      if (bindingInfos[datasetId].sheetNm === args.sheetName) {
        const newBindingInfo = _.cloneDeep(bindingInfos[datasetId]);
        newBindingInfo.sheetNm = undefined;
        newBindingInfo.useBind = false;
        dispatch(setBindingInfo({
          reportId: reportId,
          datasetId: datasetId,
          bindingInfo: newBindingInfo
        }));
      }
    });
  };

  const sheetNameChangedListener = (designer) => {
    designer.getWorkbook().bind(sheets.Events.SheetNameChanged,
        renameSheet);
  };

  const renameSheet = (e, args) => {
    Object.keys(bindingInfos).forEach((datasetId) => {
      if (bindingInfos[datasetId].sheetNm === args.oldValue) {
        const newBindingInfo = _.cloneDeep(bindingInfos[datasetId]);
        newBindingInfo.sheetNm = args.newValue;
        dispatch(setBindingInfo({
          reportId: reportId,
          datasetId: datasetId,
          bindingInfo: newBindingInfo
        }));
      }
    });
  };

  const createReportBlob = async () => {
    const workbook = getWorkbook();
    const json = workbook.toJSON({includeBindingSource: false});
    const blob = await new Promise((resolve, reject) => {
      excelIO.save(JSON.stringify(json), resolve, reject);
    });
    return blob;
  };

  const setExcelFile = async (reportId) => {
    const response = await importFile({fileName: reportId + '.xlsx'});
    let data;
    if (response.status !== 200) {
      data = defaultWorkbookJSON;
      insertWorkbookJSON({
        reportId: reportId,
        workbookJSON: defaultWorkbookJSON
      });
    } else {
      data = response.data;
    }
    const blob = new Blob(
        [data],
        {type: excelFileType}
    );

    await excelIoOpen(reportId, blob);
  };

  const excelIoOpen = (reportId, file) => {
    return new Promise((resolve, reject) => {
      excelIO.open(
          file,
          (json) => {
            insertWorkbookJSON({
              reportId: reportId,
              workbookJSON: json
            });
            resolve();
          },
          () => {
            insertWorkbookJSON({
              reportId: reportId,
              workbookJSON: defaultWorkbookJSON
            });
            reject(new Error('Failed to open excel'));
          },
          excelIOOpenOtions);
    });
  };

  return {
    bindData,
    sheetChangedListener,
    sheetNameChangedListener,
    createReportBlob,
    setExcelFile
  };
};

export default useSpread;
