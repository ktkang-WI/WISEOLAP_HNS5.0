import * as XLSX from 'xlsx';
import {exportWidgets} from 'devextreme/viz/export';

const extractingKeys = (data) => {
  const keys = [];
  try {
    // Array check
    if (typeof data !== 'object') return null;

    data = data[0];

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

const extractingValues = (data) => {
  const keys = extractingKeys(data);
  if (!keys) return null;
  const result = data.map((data) => keys.map((key) => {
    return data[key];
  }));
  return result;
};

const convertToCsv = (data) => {
  const keys = extractingKeys(data);
  if (!keys) return null;
  const values = extractingValues(data);
  if (!values) return null;
  values.unshift(keys);

  return values.map((item) => item.join(',')).join('\n');
};

const convertToTxt = (data) => {
  const keys = extractingKeys(data);
  if (!keys) return null;
  const values = extractingValues(data);
  if (!values) return null;

  values.unshift(keys);

  return values.map((item) => item.join('\t')).join('\n');
};

const convertToXlsx = (data) => {
  const keys = extractingKeys(data);
  if (!keys) return null;
  const values = extractingValues(data);
  if (!values) return null;

  values.unshift(keys);

  return values;
};

const convertToFormat = (data, type) => {
  let result = null;
  if (type === Type.TXT) {
    result = convertToTxt(data);
  } else if (type === Type.CSV) {
    result = convertToCsv(data);
  } else if (type === Type.XLSX) {
    result = convertToXlsx(data);
  }
  return result;
};

export const exportToFile = (name, data, type) => {
  if (Type.IMG === type) {
    exportImgFile(name, data, type);
  } else {
    exportFile(name, convertToFormat(data, type), type);
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
  const ref = pickItem.ref.filter((item) => item !== null);
  if (Array.isArray(ref)) {
    ref.forEach((current) => refInstance.push(current.instance));
  } else {
    refInstance.push(ref.current.instance);
  }
  exportWidgets([...refInstance], {
    fileName: name,
    format: type
  });
};

const exportFile = (name, data, type) => {
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
};
