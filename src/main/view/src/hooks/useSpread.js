import {useDispatch} from 'react-redux';
import store from 'redux/modules';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectBindingInfos, selectCurrentDesigner,
  selectExcelIO,
  selectSheets} from 'redux/selector/SpreadSelector';

const useSpread = () => {
  const sheets = selectSheets(store.getState());
  const dispatch = useDispatch();
  const {setBindingInfo} = SpreadSlice.actions;

  const bindData = ({dataset, datas}) => {
    const designer = selectCurrentDesigner(store.getState());
    const bindingInfos = selectBindingInfos((store.getState()));
    const bindingInfo = bindingInfos[dataset.datasetId];
    // foreach로 bindingInfos에서 datasetId로 찾아서 진행
    // 추후 메게변수로 가져와야함.
    const {columns} = generateColumns(datas);
    let bindedSheet = designer.getWorkbook()
        .getSheetFromName(bindingInfo.sheetNm);

    if (bindedSheet == undefined) {
      designer.getWorkbook().addSheet(0,
          new sheets.Worksheet(bindingInfo.sheetNm));
      bindedSheet = designer.getWorkbook()
          .getSheetFromName(bindingInfo.sheetNm);
    }

    const {invoice, dataSource} = dataSourceMaker(datas);
    createColumnsAndRows(columns, invoice, bindedSheet, bindingInfo);
    deleteTables(bindedSheet);

    designer.getWorkbook().suspendPaint();

    const table = bindedSheet.tables.add('table'+ bindingInfo.sheetNm,
        bindingInfo.rowIndex,
        bindingInfo.columnIndex,
        invoice.records.length+1,
        columns.length,
        createBorderStyle(bindingInfo.useBorder));

    table.showHeader(true);
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

    designer.getWorkbook().resumePaint();
  };

  const createColumnsAndRows = (columns, invoice, bindedSheet, bindingInfo) => {
    const bindedSheetColumnNum = bindedSheet.getColumnCount();
    const dataLengthWithColumnPosition =
     columns.length + bindingInfo.columnIndex;
    const bindedSheetRowNum = bindedSheet.getRowCount();
    const dataLengthWithRowPosition =
      invoice.records.length + bindingInfo.rowIndex + 1;
    if (dataLengthWithColumnPosition > bindedSheetColumnNum) {
      bindedSheet.addColumns(bindedSheetColumnNum,
          dataLengthWithColumnPosition - bindedSheetColumnNum);
    };
    if (dataLengthWithRowPosition > bindedSheetRowNum) {
      bindedSheet.addRows(bindedSheetRowNum,
          dataLengthWithRowPosition - bindedSheetRowNum);
    };
  };

  const generateColumns = (datas) => {
    const columns = [];
    const header = [];
    const columnKeys = Object.keys(datas[0]);
    columnKeys.forEach((columnKey) => {
      const spreadColumnObj = new sheets.Tables.TableColumn();
      spreadColumnObj.name(columnKey);
      spreadColumnObj.dataField(columnKey);

      columns.push(spreadColumnObj);
      header[columnKey] = columnKey;
    });

    return {columns: columns, header: header};
  };

  const sheetChangedListener = () => {
    const designer = selectCurrentDesigner(store.getState());
    designer.getWorkbook().bind(sheets.Events.SheetChanged, changSheet);
  };

  const changSheet = (e, args) => {
    if (args.propertyName === 'deleteSheet') {
      deletedSheet(e, args);
    }
  };

  const deletedSheet = (e, args) => {
    const bindingInfos = selectBindingInfos(store.getState());
    const reportId = selectCurrentReportId(store.getState());
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

  const sheetNameChangedListener = () => {
    const designer = selectCurrentDesigner(store.getState());
    designer.getWorkbook().bind(sheets.Events.SheetNameChanged,
        renameSheet);
  };

  const renameSheet = (e, args) => {
    const reportId = selectCurrentReportId(store.getState());
    const bindingInfos = selectBindingInfos(store.getState());
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

  const dataSourceMaker = (datas) => {
    const sheet = selectSheets(store.getState());

    const recodes = datas.map((data) => {
      return new Record(data);
    });
    const invoice = new Invoice(recodes);
    return {invoice: invoice,
      dataSource: new sheet.Bindings.CellBindingSource(invoice)};
  };

  const Record = function(_data) {
    for (const key in _data) {
      if (Object.hasOwn(_data, key)) {
        this[key] = _data[key];
      }
    }
  };

  const Invoice = function(records) {
    this.records = records;
  };

  const deleteTables = (bindedSheet) => {
    bindedSheet.tables.all().forEach((table) => {
      const name = table.tableName();
      if (name.indexOf('table') > -1) {
        bindedSheet.tables.remove(name);
      }
    });
  };

  const positionConverterAsObject = (str) => {
    if (_.isEmpty(str)) {
      return {rowIndex: null, columnIndex: null};
    } else {
      const regExp = new RegExp('([a-zA-Z]+)([\\d]+)');
      const match = regExp.exec(str);
      if (match) {
        const str = match[1];
        const rowIndex = Number(match[2]);
        let columnIndex = 0;
        for (let i = 0; i < str.length; i++) {
          columnIndex *= 26;
          columnIndex += str.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
        }
        return {
          columnIndex: columnIndex - 1,
          rowIndex: rowIndex -1
        };
      } else {
        return {
          columnIndex: 0,
          rowIndex: 0
        };
      }
    }
  };

  /**
   * @param {number} columnIndex
   * @param {number} rowIndex
   * @return {string}
   */
  const positionConverterAsString = (columnIndex, rowIndex) => {
    let position = '';
    if (!_.isNil(columnIndex) && !_.isNil(rowIndex)) {
      columnIndex += 1;
      while (columnIndex > 0) {
        const remainder = (columnIndex - 1) % 26;
        position = String.fromCharCode(65 + remainder) + position;
        columnIndex = Math.floor((columnIndex - 1) / 26);
      }
      position += (rowIndex + 1);
    }
    return position;
  };

  const createBorderStyle = (useBorder) => {
    const sheets = selectSheets(store.getState());
    const tableStyle = new sheets.Tables.TableTheme();
    const thinBorder = undefined;
    if (useBorder) {
      thinBorder = new sheets.LineBorder('black', 1);
    }
    tableStyle.wholeTableStyle(new sheets.Tables.TableStyle(
        undefined, undefined, undefined, thinBorder,
        thinBorder, thinBorder, thinBorder, thinBorder, thinBorder));
    return tableStyle;
  };

  const createReportBlob = async () => {
    const excelIO = selectExcelIO(store.getState());
    const designer = selectCurrentDesigner(store.getState());
    const json = designer.getWorkbook().toJSON({includeBindingSource: false});
    const blob = await new Promise((resolve, reject) => {
      excelIO.save(JSON.stringify(json), resolve, reject);
    });
    return blob;
  };

  return {
    bindData,
    sheetChangedListener,
    sheetNameChangedListener,
    positionConverterAsObject,
    positionConverterAsString,
    createReportBlob
  };
};

export default useSpread;
