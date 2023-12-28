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

const convertToFormat = (data, type) => {
  let result = null;
  if (type === Type.TXT) {
    result = convertToTxt(data);
  } else if (type === Type.CSV) {
    result = convertToCsv(data);
  }
  return result;
};

export const exportToFile = (name, data, type) => {
  exportFile(name, convertToFormat(data, type), type);
};

export const Type = {
  CSV: 'csv',
  TXT: 'txt',
  IMG: 'img'
};

const exportFile = (name, data, type) => {
  let blob = null;
  if (type === Type.CSV) {
    blob = new Blob(['\uFEFF'+data], {type: 'text/csv;charset=utf-8,'});
  } else if (type === Type.TXT) {
    blob = new Blob([data], {type: 'text/plain;charset=utf-8'});
  };
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = name+'.'+type;
  link.click();
};
