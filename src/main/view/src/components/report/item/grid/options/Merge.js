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
  (depth, baseKey, fields, data, structure) => {
    const isLastPoint = depth === fields.length || data.length == 0;
    if (isLastPoint) return structure;

    baseKey = generateKey(baseKey, depth);
    const pickedItem = data[0];
    const fieldName = fields[depth].name;
    const node = _.cloneDeep(Node);
    const key = baseKey.concat(pickedItem[fieldName]);

    if (structure[key]) {
      structure[key].value = structure[key].value + 1;
    } else {
      structure[key] = node;
    }
    structure =
      generateRowSpan(depth + 1, key, fields, data, structure);

    data.shift();

    structure =
      generateRowSpan(0, '', fields, data, structure);

    return structure;
  };

export const generateRowSpans = (data, fields) => {
  let rowSpansStructure = {};
  if (!data) return null;
  if (!fields) return null;

  rowSpansStructure =
    generateRowSpan(0, '', fields, data, rowSpansStructure);

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
