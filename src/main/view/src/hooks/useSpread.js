import store from 'redux/modules';
import {selectBindingInfos, selectCurrentDesigner,
  selectSheets} from 'redux/selector/SpreadSelector';

export default function useSpread() {
  const sheets = selectSheets(store.getState());

  const bindData = ({dataset, datas}) => {
    dataset.datasrcId = 'test';
    const designer = selectCurrentDesigner((store.getState()));
    const bindingInfos = selectBindingInfos((store.getState()));
    const bindingInfo = bindingInfos[dataset.datasrcId];
    // foreach로 bindingInfos에서 datasetId로 찾아서 진행
    // 추후 메게변수로 가져와야함.
    const {columns} = generateColumns(datas);

    let bindedSheet = designer.getWorkbook()
        .getSheetFromName(bindingInfo.sheetName);

    if (bindedSheet == undefined) {
      designer.getWorkbook().addSheet(0,
          new sheets.Worksheet(bindingInfo.sheetName));
      bindedSheet = designer.getWorkbook()
          .getSheetFromName(bindingInfo.sheetName);
    }

    createColumnsAndRows(columns, bindedSheet, bindingInfo);

    const {invoice, dataSource} = dataSourceMaker(datas);

    designer.getWorkbook().suspendPaint();

    deleteTables(bindedSheet);

    const table = bindedSheet.tables.add('table'+ bindingInfo.sheetName,
        bindingInfo.rowIndex,
        bindingInfo.columnIndex,
        invoice.records.length+1,
        columns.length,
        createBoarderStyle(bindingInfo.useBoarder));

    table.showHeader(true);
    // 테이블 컬럼 자동 생성
    table.autoGenerateColumns(false);
    table.bindColumns(columns);
    table.bindingPath('records');
    table.bandRows(false);
    table.bandColumns(false);
    // 그리드 라인 설정 옵션
    bindedSheet.options.gridline.showHorizontalGridline = true;
    bindedSheet.options.gridline.showVerticalGridline = true;
    bindedSheet.invalidateLayout();

    bindedSheet.setDataSource(dataSource);
    table.filterButtonVisible(false);

    designer.getWorkbook().resumePaint();
  };

  const createColumnsAndRows = (columns, bindedSheet, bindingInfo) => {
    const bindedSheetColumnNum = bindedSheet.getColumnCount();
    const dataLengthWithColumnPosition =
     columns.length + bindingInfo.columnIndex;
    const bindedSheetRowNum = bindedSheet.getRowCount();
    const dataLengthWithRowPosition =
     columns.length + bindingInfo.rowIndex;
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
    const sheets = selectSheets(store.getState());
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

  const sheetNameChangedListener = () => {
    const designer = selectCurrentDesigner(store.getState());
    designer.getWorkbook().bind(sheets.Events.SheetChanged, renameSheet);
  };

  const renameSheet = (e, args) => {
    console.log(e);
    console.log(args);
  };

  const sheetDeletedListener = () => {
    const designer = selectCurrentDesigner(store.getState());
    designer.getWorkbook().bind(sheets.Events.SheetNameChanged,
        deletedSheet);
  };

  const deletedSheet = (e, args) => {
    if (args.propertyName === 'deleteSheet') {
      console.log(e);
      console.log(args);
    }
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
    const regExp = new RegExp('([a-zA-Z]+)(\\d+)');
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
        rowIndex: rowIndex
      };
    } else {
      throw new Error('position Coverter Error');
    }
  };

  const positionConverterAsString = (columnIndex) => {
    columnIndex -= 1;
    let columnName = '';
    while (number > 0) {
      const remainder = (number - 1) % 26;
      columnName = String.fromCharCode(65 + remainder) + columnName;
      number = Math.floor((number - 1) / 26);
    }
    return columnName;
  };

  const createBoarderStyle = (useBoarder) => {
    const sheets = selectSheets(store.getState());
    const tableStyle = new sheets.Tables.TableTheme();
    const thinBorder = undefined;
    if (useBoarder) {
      thinBorder = new sheets.LineBorder('black', 1);
    }
    tableStyle.wholeTableStyle(new sheets.Tables.TableStyle(
        undefined, undefined, undefined, thinBorder,
        thinBorder, thinBorder, thinBorder, thinBorder, thinBorder));
    return tableStyle;
  };

  return {
    bindData,
    sheetNameChangedListener,
    sheetDeletedListener,
    positionConverterAsObject,
    positionConverterAsString
  };
};

