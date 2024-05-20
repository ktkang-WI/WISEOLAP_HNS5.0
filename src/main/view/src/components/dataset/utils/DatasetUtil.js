import localizedString from 'config/localization';
import meaImg from 'assets/image/icon/dataSource/measure.png';
import folderImg from 'assets/image/icon/report/folder_load.png';
export const uniqueNameType = {
  CUSTOM_DATA: '987654321'
};
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

export const makeCustomDataFieldIcon = (fields) => {
  let generatedFields = null;
  generatedFields = fields.map((field) => {
    return {
      isCustomData: true,
      icon: meaImg,
      parentId: uniqueNameType.CUSTOM_DATA,
      uniqueName: field.fieldName,
      name: field.fieldName,
      expression: field.expression,
      type: 'MEA'
    };
  });
  generatedFields.unshift({
    name: localizedString.defaultCustomDataName,
    type: 'FLD',
    parentId: null,
    uniqueName: uniqueNameType.CUSTOM_DATA,
    icon: folderImg
  });
  return generatedFields;
};

// 데이터 집합 및 사용자 정의 데이터 필드
export const getAllCurrentFields = (dataset) => {
  return dataset?.fields?.filter((item) => item.type != 'FLD');
};

// 데이터 집합 필드
export const getCurrentFields = (dataset) => {
  return dataset.fields.filter((item) =>
    item.uniqueName != uniqueNameType.CUSTOM_DATA &&
    item.parentId != uniqueNameType.CUSTOM_DATA);
};

