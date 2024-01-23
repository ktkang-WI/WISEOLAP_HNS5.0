import meaImg from 'assets/image/icon/dataSource/measure.png';
import dimImg from 'assets/image/icon/dataSource/dimension.png';
import folderImg from 'assets/image/icon/report/folder_load.png';
import localizedString from 'config/localization';

export const makeFieldIcon = (fields) => {
  fields = fields.filter((field) => field.uniqueName !== 0)
      .map((field) => ({
        icon: field.columnTypeName === 'decimal' ? meaImg : dimImg,
        parentId: '0',
        uniqueName: field.columnName,
        name: field.columnName,
        type: field.columnTypeName === 'decimal' ? 'MEA' : 'DIM',
        ...field
      }));
  fields.unshift({
    name: localizedString.defaultDatasetName,
    type: 'FLD',
    uniqueName: '0',
    icon: folderImg
  });
  return fields;
};
