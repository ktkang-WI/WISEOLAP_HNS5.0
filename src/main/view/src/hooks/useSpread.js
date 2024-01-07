import store from 'redux/modules';
import {selectCurrentBindingInfos, selectCurrentDesigner,
  selectSheets} from 'redux/selector/SpreadSelector';

export default function useSpread() {
  const sheets = selectSheets(store.getState());

  const bindData = ({dataset, datas}) => {
    dataset.datasrcId = 'test';
    const designer = selectCurrentDesigner((store.getState()));
    const bindingInfos = selectCurrentBindingInfos((store.getState()));
    const bindingInfo = bindingInfos[dataset.datasrcId];
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

    createColumnsAndRows(columns, bindedSheet, bindingInfo);

    const {invoice, dataSource} = dataSourceMaker(datas);

    designer.getWorkbook().suspendPaint();

    deleteTables(bindedSheet);

    const table = bindedSheet.tables.add('table'+ bindingInfo.sheetNm,
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
  // const createColumnName = () => {
  //   const preAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //   const alphabetLength = preAlphabet.length + 1;
  //   const preAlphabetIndex = Math.floor(index / alphabetLength);
  //   return preAlphabetIndex;
  // };

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

  return {bindData,
    sheetNameChangedListener,
    sheetDeletedListener
  };
};

