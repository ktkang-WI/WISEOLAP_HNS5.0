import store from 'redux/modules';
import {selectCurrentWorkbook,
  selectSheets} from 'redux/selector/SpreadSelector';

export default function useSpread() {
  const bindData = () => {
    const workbook = selectCurrentWorkbook(store.getState);
    const sheets = selectSheets(store.getState);
    const bindingInfo = selectCurrentBindingInfo(store.getState));
    // 추후 메게변수로 가져와야함.
    const sheetIndex = 1;
    const activeSheet = sheets.getSheet(sheetIndex);
    const {columns, header} = generateColumns;

    if((columns.length + self.bindingColRow[sheetNm].columns + 1) > activeSheet.getColumnCount() || (_data.length + self.bindingColRow[sheetNm].rows + 1) > activeSheet.getRowCount()){
			if((columns.length + self.bindingColRow[sheetNm].columns + 1) > activeSheet.getColumnCount() ){
				activeSheet.addColumns(activeSheet.getColumnCount(), ((columns.length + self.bindingColRow[sheetNm].columns + 1) - activeSheet.getColumnCount()));
			}
			
			if( (_data.length + self.bindingColRow[sheetNm].rows + 1) > activeSheet.getRowCount() ){
				activeSheet.addRows(activeSheet.getRowCount(), ((_data.length + self.bindingColRow[sheetNm].rows + 1) - activeSheet.getRowCount()));
			}
		}
  };

  const generateColumns = (dataSources) => {
    const sheets = selectSheets(store.getState);
    const columns = [];
    const header = [];
    dataSources.foreach((dataSource, index) => {
      const spreadColumnObj = new sheets.Tables.TableColumn();
      const columnKey = Object.keys(_dataSources[0]);
      spreadColumnObj.name(columnKey[index]);
      spreadColumnObj.dataField(columnKey[index]);

      columns.push(spreadColumnObj);
      header[columnKey[_i]] = columnKey[_i];
    });

    return {columns: columns, header: header};
  };

  const createColumnName = () => {
    const preAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphabetLength = preAlphabet.length + 1;
    const preAlphabetIndex = Math.floor(index / alphabetLength);
    return preAlphabetIndex;
  };

  const testData = [{
    1: '2',
    3: '4'
  }];


  return {bindData};
};

