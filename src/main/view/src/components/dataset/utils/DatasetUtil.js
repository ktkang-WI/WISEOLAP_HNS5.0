import meaImg from 'assets/image/icon/dataSource/measure.png';
import dimImg from 'assets/image/icon/dataSource/dimension.png';
import folderImg from 'assets/image/icon/report/folder_load.png';
import localizedString from 'config/localization';

export const makeFieldIcon = (fields) => {
  fields = fields.reduce((returnArr, field) => {
    if (field.uniqueName != 0) {
      returnArr.push({
        icon: field.columnTypeName === 'decimal' ? meaImg : dimImg,
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
    uniqueName: '0',
    icon: folderImg
  });
  return fields;
};
