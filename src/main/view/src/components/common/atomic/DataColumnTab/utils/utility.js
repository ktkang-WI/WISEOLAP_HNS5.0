
import {makeMetaDataField, metaDataField}
  from 'components/report/item/util/metaUtilityFactory';
import localizedString from 'config/localization';
import _ from 'lodash';

// private
const getCustomDatas = (field, sourceField) => {
  if (!sourceField.isCustomData) return null;
  field.expression = sourceField.expression;
  return field;
};

const measureOption = (tempField, sourceField) => {
  return {
    format: {
      formatType: 'Number',
      unit: 'Ones',
      suffixEnabled: false,
      suffix: {
        O: '',
        K: localizedString.k,
        M: localizedString.m,
        B: localizedString.b
      },
      precision: 0,
      precisionType: 'round',
      useDigitSeparator: true
    },
    summaryType: tempField.fieldType == 'MEA' ? sourceField?.summaryType ?
      sourceField?.summaryType.toUpperCase() :'SUM' : 'MIN'
  };
};

const getDataFieldType = (dataFieldOption, sourceField, droppableId) => {
  const category = droppableId;
  if (category === 'field') {
    return sourceField.fieldType || sourceField.type;
  }
  return dataFieldOption[category].type;
};

const tempField = (dataFieldOption, sourceField, droppableId) => {
  return {
    name: sourceField.name,
    uniqueName: sourceField.uniqueName,
    caption: sourceField.caption || sourceField.name,
    category: droppableId ? droppableId : 'measure',
    fieldType: sourceField.fieldType || sourceField.type, // 데이터 항목 원본 타입
    type: dataFieldOption && sourceField && droppableId ? getDataFieldType(
        dataFieldOption,
        sourceField,
        droppableId) : 'MEA' // 실제 조회할 때 적용되어야 할 type
  };
};

const getTempField = (
    dataFieldOption,
    sourceField,
    droppableId) => {
  return _.cloneDeep(tempField(dataFieldOption, sourceField, droppableId));
};

// public
export const getNewDataField = (
    dataField,
    dataFieldOption = false,
    sourceField,
    droppableId = false) => {
  let tempField = getTempField(dataFieldOption, sourceField, droppableId);
  const customDatas = getCustomDatas(tempField, sourceField);

  if (customDatas) tempField = customDatas;

  // 필드아이디가 있는 경우 기존 아이템 이동
  if (sourceField.fieldId) {
    tempField = {...sourceField, ...tempField};
  } else {
    const prefix = dataFieldOption ? 'dataItem' : 'customData';
    tempField.fieldId = prefix + (dataField.dataFieldQuantity++);
  }

  const dimensionOption = {
    sortBy: tempField.fieldId,
    sortOrder: 'ASC'
  };

  if (!sourceField.fieldId ||
    (sourceField.fieldId && sourceField.type != tempField.type)) {
    if (tempField.type == 'MEA') {
      tempField = {...tempField, ...measureOption(tempField, sourceField)};
    } else {
      tempField = {...tempField, ...dimensionOption};
    }
  }
  if (metaDataField[tempField.category]) {
    tempField = makeMetaDataField(tempField, tempField.category);
  }
  return tempField;
};
