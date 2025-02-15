import {sheets} from './SpreadCore';

export const createColumnsAndRows = (
    columns,
    invoice,
    bindedSheet,
    bindingInfo
) => {
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

export const generateColumns = (metaData, sheets) => {
  const columns = [];
  const header = [];
  metaData.forEach((meta) => {
    const columnKey = meta.columnName;
    const spreadColumnObj = new sheets.Tables.TableColumn();
    spreadColumnObj.name(columnKey);
    spreadColumnObj.dataField(columnKey);
    columns.push(spreadColumnObj);
    header[columnKey] = columnKey;
  });
  return {columns: columns, header: header};
};

export const Record = function(_data) {
  for (const key in _data) {
    if (Object.hasOwn(_data, key)) {
      this[key] = _data[key];
    }
  }
};

export const Invoice = function(records) {
  this.records = records;
};

export const deleteTables = (bindedSheet) => {
  bindedSheet.tables.all().forEach((table) => {
    const name = table.tableName();
    if (name.indexOf('table') > -1) {
      bindedSheet.tables.remove(name);
    }
  });
};

export const positionConverterAsObject = (strWithNum) => {
  if (_.isEmpty(strWithNum)) {
    return {rowIndex: null, columnIndex: null};
  } else {
    const regExp = new RegExp('([a-zA-Z]+)([\\d]+)');
    const match = regExp.exec(strWithNum);
    const str = match[1].toUpperCase();
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
  }
};

/**
   * @param {number} columnIndex
   * @param {number} rowIndex
   * @return {string}
   */
export const positionConverterAsString = (columnIndex, rowIndex) => {
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

export const dataSourceMaker = (rowData, sheets) => {
  const recodes = rowData.map((data) => {
    return new Record(data);
  });
  const invoice = new Invoice(recodes);
  return {invoice: invoice,
    dataSource: new sheets.Bindings.CellBindingSource(invoice)};
};

export const createBorderStyle = (useBorder) => {
  const tableStyle = new sheets.Tables.TableTheme();
  let thinBorder = undefined;
  if (useBorder) {
    thinBorder = new sheets.LineBorder('black', 1);
  }
  tableStyle.wholeTableStyle(new sheets.Tables.TableStyle(
      undefined, undefined, undefined, thinBorder,
      thinBorder, thinBorder, thinBorder, thinBorder, thinBorder));
  return tableStyle;
};

export const getJsonKey2ColInfos = (rowData, bindingInfo, bindedSheet) => {
  if (_.isEmpty(rowData)) return {colInfos: [], dataSourceHearder: []};

  const key = Object.keys(rowData[0]);

  // 임시 코드 TODO : 추후 환경설정 SpreadBinding 분기 개발 되면 삭제 예정
  if (bindingInfo.columnIndex > 0) {
    for (let i = 0; i < bindingInfo.columnIndex; i++) {
      key.unshift('');
    }
  }

  let colInfos = [];
  const dataSourceHearder = {};

  const getColumnName = (index) => {
    let columnName = '';

    while (index >= 0) {
      columnName = String.fromCharCode((index % 26) + 65) + columnName;
      index = Math.floor(index / 26) - 1;
    }

    return columnName;
  };

  key.map((value, index) => {
    const disName = getColumnName(index);
    colInfos.push({name: key[index], displayName: disName});
    dataSourceHearder[key[index]] = key[index];
  });

  // 시트 바인딩 열 너비 유지
  colInfos = colInfos.map((col, i) =>
    ({...col, size: bindedSheet.getColumnWidth(i)}));

  return {colInfos: colInfos, dataSourceHearder: dataSourceHearder};
};

