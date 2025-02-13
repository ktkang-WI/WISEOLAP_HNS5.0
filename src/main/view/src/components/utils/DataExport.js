import * as XLSX from 'xlsx';
import {exportWidgets} from 'devextreme/viz/export';
import _ from 'lodash';
import {
  exportExcel
} from 'components/report/util/reportDownload/ReportDownload';
import store from 'redux/modules';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import {selectCurrentItems, selectRootItem} from 'redux/selector/ItemSelector';
import {selectCurrentInformationas, selectCurrentValues}
  from 'redux/selector/ParameterSelector';

const extractingKeys = (data) => {
  const keys = [];
  try {
    // Array check
    if (typeof data !== 'object') return null;

    data = Array.isArray(data) ? data[0] : data;

    // Map check
    if (typeof data !== 'object') return null;

    const tempObject = Object.entries(data);

    for (const [key] of tempObject) {
      keys.push(key);
    }

    if (keys.length === 0) return null;
  } catch (error) {
    console.error(error);
  }
  return keys;
};

// TODO: 필드명 다음 체크리스트 값 막아야함.
const wasteDisposalKey = (key) => {
  const checkList = ['SUM_', 'AVG_', 'MIN_', 'MAX_'];
  let start = 0;
  const end = key.length;
  for (let index = 0; index < checkList.length; index++) {
    const checkKey = checkList[index];
    const checkKeyLen = checkKey.length;
    const point = key.indexOf(checkKey);
    if (point != -1) {
      start = point + checkKeyLen;
    }
  };
  if (start == 0) return key;
  return key.substring(start, end);
};

const renameObjectKey = (obj, oldKeyName, newKeyName) => {
  const tempObj = obj;
  tempObj[newKeyName] = tempObj[oldKeyName];
  delete tempObj[oldKeyName];
  return tempObj;
};

const sortObject = (obj) => {
  const keys = Object.keys(obj);

  // 데이터 그리드 순서 안맞는 현상 정렬 주석처리
  // keys = keys.sort();

  if (!keys) {
    console.error('정렬 작업중 오류 발생 수정 필요 !!');
    return null;
  };

  const sortedObject = {};

  keys.forEach((key) => {
    sortedObject[key] = obj[key];
  });

  if (!sortedObject) {
    console.error('정렬 작업중 오류 발생 수정 필요 !!');
    return obj;
  }

  return sortedObject;
};

const extractingValues = (insertedData) => {
  const result = insertedData.map((data) => {
    let tempData = _.cloneDeep(data);
    tempData = sortObject(tempData);
    const keys = extractingKeys(tempData);
    if (!keys) return null;
    return keys.map((key) => {
      const newKeyName = wasteDisposalKey(key);
      if (key !== newKeyName) {
        const redefinedData = renameObjectKey(tempData, key, newKeyName);
        return redefinedData[newKeyName];
      }
      return tempData[key];
    });
  });
  return result;
};

const mergeHeaderValue = (data) => {
  // 데이터 그리드 순서 안맞는 현상 정렬 주석처리
  // let keys = extractingKeys(data).sort();
  const keys = extractingKeys(data);
  if (!keys) return null;
  // keys = keys.map((key) => wasteDisposalKey(key));
  keys.forEach((value, index, arr) => {
    arr[index] = wasteDisposalKey(value);
  });
  const values = extractingValues(data);
  if (!values) return null;
  values.unshift(keys);

  return values;
};

const convertToCsv = (data) => {
  const values = mergeHeaderValue(data);
  if (!values) return null;
  return values.map((item) => item.join(',')).join('\n');
};

const convertToTxt = (data) => {
  const values = mergeHeaderValue(data);
  if (!values) return null;
  return values.map((item) => item.join('\t')).join('\n');
};

const convertToXlsx = (data) => {
  const values = mergeHeaderValue(data);
  if (!values) return null;
  return values;
};

const convertToFormat = (data, type) => {
  let result = null;
  if (type === Type.TXT) {
    result = convertToTxt(data);
  } else if (type === Type.CSV) {
    result = convertToCsv(data);
  } else if (type === Type.XLSX || type.endsWith('XLSX')) {
    result = convertToXlsx(data);
  }
  return result;
};

export const exportToFile = (name, data, type, pickItem) => {
  if (Type.IMG === type) {
    exportImgFile(name, data, type);
  } else {
    exportFile(name, convertToFormat(data, type), type, pickItem);
  }
};

export const Type = {
  CSV: 'csv',
  TXT: 'txt',
  IMG: 'PNG',
  XLSX: 'xlsx'
};

const s2ab = (s) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
};

const exportImgFile = (name, pickItem, type) => {
  const refInstance = [];
  let ref = pickItem.ref;
  if (Array.isArray(ref)) {
    ref = ref.filter((item) => item !== null);
    ref.forEach((current) => refInstance.push(current.instance));
  } else {
    refInstance.push(ref.current.instance);
  }
  exportWidgets([...refInstance], {
    fileName: name,
    format: type
  });
};


const exportFile = (name, data, type, pickItem) => {
  const currentReport = selectCurrentReport(store.getState());
  const currentItem = selectCurrentItems(store.getState());
  const currentParameter = selectCurrentInformationas(store.getState());
  const currentParameterValues = selectCurrentValues(store.getState());
  const rootItem = selectRootItem(store.getState());
  const dataSource = _.cloneDeep(currentReport.options);

  // 비정형인 경우 레이아웃 설정에 따라 다운로드 되는 아이템이 달라야 함.
  // (ex. 그리드만 보기 -> 전체 다운로드 -> 그리드만 다운로드)
  const filterdLayoutItem = () => {
    if (!rootItem.adHocOption) return currentItem;

    let items = currentItem.filter((item) =>
      item.type == rootItem.adHocOption.layoutSetting
    );

    if (items.length === 0) { // 차트 피벗 전부 보기인 경우.
      items = currentItem;
    }

    return items;
  };

  if (pickItem?.type === 'pivot') {
    const newCurrentItem = filterdLayoutItem()
        .filter((item) => item.id === pickItem.id);

    const option = {
      mergeColumn: type === Type.XLSX,
      mergeRow: type === Type.XLSX
    };
    exportExcel(
        currentReport,
        newCurrentItem,
        currentParameter,
        currentParameterValues,
        dataSource,
        option,
        name);
  } else {
    let blob = null;
    if (type === Type.CSV) {
      blob = new Blob(['\uFEFF'+data], {type: 'text/csv;charset=utf-8,'});
    } else if (type === Type.TXT) {
      blob = new Blob([data], {type: 'text/plain;charset=utf-8'});
    } else if (type === Type.XLSX) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
      blob = new Blob([s2ab(wbout)],
          {type: 'application/octet-stream;charset=utf-8'});
    };
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name+'.'+type;
    link.click();
  }
};
