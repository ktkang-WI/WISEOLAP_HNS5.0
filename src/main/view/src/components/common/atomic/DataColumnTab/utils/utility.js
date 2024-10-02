
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

const getSummaryType = (tempField, sourceField) => {
  let summaryType = tempField.fieldType == 'MEA' ? sourceField?.summaryType ?
    sourceField?.summaryType.toUpperCase() :'SUM' : 'MIN';

  // 차원을 측정값 항목에 올린경우 summaryType은 카운트가 디폴트
  if (tempField.category !== 'sortByItem') {
    if (tempField.fieldType == 'DIM' && tempField.type == 'MEA') {
      summaryType = 'COUNT';
    }
  }

  return summaryType;
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
    summaryType: getSummaryType(tempField, sourceField)
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

  if (!['field', 'sortByItem'].includes(droppableId) &&
    tempField.type != tempField.fieldType) {
    if (tempField.fieldType == 'DIM') {
      return '해당 영역에는 측정값만 올릴 수 있습니다.';
    } else {
      return '해당 영역에는 차원만 올릴 수 있습니다.';
    }
  }

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
