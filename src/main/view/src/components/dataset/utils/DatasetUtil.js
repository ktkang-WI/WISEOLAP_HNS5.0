import localizedString from 'config/localization';

export const makeFieldIcon = (fields) => {
  fields = fields.reduce((returnArr, field) => {
    if (field.uniqueName != 0) {
      returnArr.push({
        parentId: '0',
        uniqueName: field.columnName,
        name: field.columnName,
        type: field.columnTypeName === 'decimal' ? 'MEA' : 'DIM',
        ...field
      });
    }
    return returnArr;
  }, []);
  fields.unshift({
    name: localizedString.defaultDatasetName,
    type: 'FLD',
    uniqueName: '0'
  });
  return fields;
};
