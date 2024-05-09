import _ from 'lodash';

const Node = {
  value: 1,
  declared: false
};

const generateBaseKey = (depth) => {
  let result = '';
  result = result.concat(depth + '-');
  return result;
};

const generateKey = (baseKey, depth) => {
  if (depth > 0) {
    baseKey = baseKey.concat('-' + generateBaseKey(depth));
  } else {
    baseKey = baseKey.concat(generateBaseKey(depth));
  }
  return baseKey;
};


const generateRowSpan =
(fields, datas, structure) => {
  let baseKey = '';
  datas.forEach((data, index) => {
    baseKey = '';
    fields.forEach((field, depth) => {
      baseKey = generateKey(baseKey, depth);
      const pickedItem = data;
      const fieldName = field.name;
      const node = _.cloneDeep(Node);
      baseKey = baseKey.concat(pickedItem[fieldName]);
      if (structure[baseKey]) {
        structure[baseKey].value = structure[baseKey].value + 1;
      } else {
        structure[baseKey] = node;
      }
    });
  });

  return structure;
};


export const generateRowSpans = (data, fields) => {
  let rowSpansStructure = {};
  if (!data) return null;
  if (!fields) return null;
  rowSpansStructure =
    generateRowSpan(fields, data, rowSpansStructure);

  return rowSpansStructure;
};

const getCellMergeKey = (columnIndex, values) => {
  let key = '';
  const valuesLen = values.length;
  for (let index = 0; index < valuesLen; index++) {
    if (columnIndex < index) break;

    const value = values[index];
    key = index === 0 ?
    key.concat(index + '-' + value) : key.concat('-' + index + '-' + value);
  };
  return key;
};

export const cellMerge = (e, rowSpans, fields) => {
  if (!rowSpans) return;
  if (e.rowType !== 'data') {
    return;
  }

  const columnIndex = e.columnIndex;
  const values = fields.map((item) => e.data[item.name]);

  if (!values) return;
  if (columnIndex === fields.length) return;

  const key = getCellMergeKey(columnIndex, values);

  if (!key || !rowSpans[key]) return;

  const rowSpan = rowSpans[key].value;
  const declared = rowSpans[key].declared;

  if (declared) {
    e.cellElement.style.display = 'none';
    return;
  }

  e.cellElement.rowSpan = rowSpan;

  if (!declared) {
    rowSpans[key].declared = true;
    return;
  }
};
