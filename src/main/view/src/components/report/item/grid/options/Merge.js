import _ from 'lodash';

const Node = {
  value: 1,
  declared: false
};

const generateBaseKey = (Index) => {
  let result = '';
  result = result.concat(Index + '-');
  return result;
};

const generateRowSpan =
  (depth, baseKey, fields, data, structure) => {
    const fieldsLen = fields.length;
    if (depth === fieldsLen || data.length == 0) return structure;
    if (depth > 0) {
      baseKey = baseKey.concat('-'+generateBaseKey(depth));
    } else {
      baseKey = baseKey.concat(generateBaseKey(depth));
    }

    const pickedItem = data[0];
    let fieldName = null;
    if (fields[depth].type === 'MEA') {
      fieldName =
      fields[depth].summaryType + '_' + fields[depth].name;
    } else {
      fieldName = fields[depth].name;
    }

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

export const cellMerge = (e, rowSpans, fields) => {
  if (!rowSpans) return;
  if (e.rowType !== 'data') {
    return;
  }

  let key = '';
  const columnIndex = e.columnIndex;
  const values = fields.map((item) => {
    if (item.type === 'DIM') return e.data[item.name];
    else return e.data[item.summaryType + '_' + item.name];
  });
  const valuesLen = values.length;

  if (!values) return;
  if (columnIndex === fields.length) return;

  for (let index = 0; index < valuesLen; index++) {
    if (columnIndex < index) break;

    const value = values[index];
    key = index === 0 ?
    key.concat(index + '-' + value) : key.concat('-' + index + '-' + value);
  };

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
