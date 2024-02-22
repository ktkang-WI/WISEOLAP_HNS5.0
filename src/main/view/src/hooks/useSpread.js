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
import localizedString from 'config/localization';
import useModal from './useModal';
import {excelIO, sheets, designer, getWorkbook}
  from 'components/report/atomic/spreadBoard/util/SpreadCore';
import {excelIOOpenOtions}
  from 'components/report/atomic/spreadBoard/util/spreadContants';
const useSpread = () => {
  const dispatch = useDispatch();
  const {setBindingInfo} = SpreadSlice.actions;
  const bindingInfos = useSelector(selectBindingInfos);
  const reportId = useSelector(selectCurrentReportId);

  const {alert} = useModal();

  const bindData = ({rowData, bindingInfo}) => {
    const workbook = getWorkbook(reportId);
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
    const json = designer.getWorkbook().toJSON({includeBindingSource: false});
    const blob = await new Promise((resolve, reject) => {
      excelIO.save(JSON.stringify(json), resolve, reject);
    });
    return blob;
  };

  const setExcelFile = (data, querySearch) => {
    const blob = new Blob(
        [data],
        {type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    );
    excelIoOpen(blob, querySearch);
  };

  const excelIoOpen = (file, querySearch) => {
    const workbook = getWorkbook(reportId);
    excelIO.open(
        file,
        (json) => {
          const workbookObj = json;
          workbook.fromJSON(workbookObj);
          if (querySearch) querySearch();
        },
        () => {
          alert(localizedString.reportCorrupted);
        },
        excelIOOpenOtions);
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
