import store from 'redux/modules';
import {selectBindingInfos, selectCurrentDesigner,
  selectSheets} from 'redux/selector/SpreadSelector';

export default function useSpread() {
  const sheets = selectSheets(store.getState());

  const bindData = (data) => {
    const designer = selectCurrentDesigner((store.getState()));
    const bindingInfos = selectBindingInfos((store.getState()));
    // 추후 메게변수로 가져와야함.
    const {columns} = generateColumns;
    const datasetNames = Object.keys(bindingInfos);

    datasetNames.forEach((datasetName) => {
      designer.getWorkbook().addSheet(0, new sheets.Worksheet('Sheet2'));
      const bindedSheet = designer.getWorkbook()
          .getSheet(bindingInfos[datasetName].datasetId);

      const bindedSheetColumnNum = bindedSheet.getColumnCount();
      const dataLengthWithColumnPosition =
       columns.length + bindingInfos[datasetName].columnIndex;

      const bindedSheetRowNum = bindedSheet.getRowCount();
      const dataLengthWithRowPosition =
       columns.length + bindingInfos[datasetName].rowIndex;

      if (dataLengthWithColumnPosition > bindedSheetColumnNum) {
        bindedSheet.addColumns(bindedSheetColumnNum,
            dataLengthWithColumnPosition - bindedSheetColumnNum);
      };

      if (dataLengthWithRowPosition > bindedSheetRowNum) {
        bindedSheet.addRows(bindedSheetRowNum,
            dataLengthWithRowPosition - bindedSheetRowNum);
      }

      // const dataSource = new sheets.Bindings.CellBindingSource(testData);
    });
  };

  const generateColumns = (dataSources) => {
    const sheets = selectSheets(store.getState());
    const columns = [];
    const header = [];
    dataSources.forEach((dataSource, index) => {
      const spreadColumnObj = new sheets.Tables.TableColumn();
      const columnKey = Object.keys(_dataSources[0]);
      spreadColumnObj.name(columnKey[index]);
      spreadColumnObj.dataField(columnKey[index]);

      columns.push(spreadColumnObj);
      header[columnKey[_i]] = columnKey[_i];
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

  const deletedSheet = (e, args) => {
    if (args.propertyName === 'deleteSheet') {
      console.log(e);
      console.log(args);
    }
  };

  const sheetDeletedListener = () => {
    const designer = selectCurrentDesigner(store.getState());
    designer.getWorkbook().bind(sheets.Events.SheetNameChanged,
        deletedSheet);
  };

  // const createColumnName = () => {
  //   const preAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //   const alphabetLength = preAlphabet.length + 1;
  //   const preAlphabetIndex = Math.floor(index / alphabetLength);
  //   return preAlphabetIndex;
  // };

  return {bindData,
    sheetNameChangedListener,
    sheetDeletedListener
  };
};

