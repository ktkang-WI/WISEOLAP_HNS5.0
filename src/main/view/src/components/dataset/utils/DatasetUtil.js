import localizedString from 'config/localization';
import meaImg from 'assets/image/icon/dataSource/measure.png';
export const uniqueNameType = {
  CUSTOM_DATA: '987654321'
};
export const makeFieldIcon = (fields, datasetNm) => {
  fields = fields.reduce((returnArr, field) => {
    if (field.uniqueName != 0) {
      returnArr.push({
        parentId: field?.parentId || '0',
        uniqueName: field.uniqueName || field.ID,
        name: field.columnName,
        type: field.columnTypeName === 'decimal' ? 'MEA' : 'DIM',
        ...field
      });
    }
    return returnArr;
  }, []);
  fields.unshift({
    // 홈앤쇼핑 데이터 집합 명으로 폴더 명 변경
    // name: localizedString.defaultDatasetName,
    name: datasetNm,
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
    uniqueName: uniqueNameType.CUSTOM_DATA
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

