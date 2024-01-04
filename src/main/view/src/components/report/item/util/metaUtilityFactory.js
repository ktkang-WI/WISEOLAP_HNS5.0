import {DataFieldType} from './dataFieldType';

// meta.dataField.dimension 설정
const getDimensionOption = (fieldOption) => {
  return {
    sortBy: fieldOption.name,
    sortOrder: 'ASC'
  };
};

// meta.dataField.measure 설정
const getMeasureOption = (fieldOption) => {
  return {
    format: {},
    summaryType: fieldOption.fieldType == 'MEA' ? 'SUM' : 'MIN'
  };
};

// meta.dataField.field 설정
const fieldOption = {
  visible: true,
  detailSetting: 'value' // (value, bar), default: value
};

/**
 * 조회 하는 type 에 따라 me.ta.dataField 의 기본 값이 달라진다.
 * 조회 하는 type이 'DIM' 일 경우, dimensionOption
 * 조회 하는 type 이 'MEA' 일 경우, measureOption
 * @param {String} type 조회하는 type
 * @param {JSON} fieldOption 이미 가지고 있는 fieldOption 값들
 * @return {JSON} type 에 따라 변경된 fieldOption 반환
 */
const makeFieldOption = (type, fieldOption) => {
  const dimensionOption = getDimensionOption(fieldOption);
  const measureOption = getMeasureOption(fieldOption);

  if (type === 'DIM') {
    delete fieldOption?.format;
    delete fieldOption?.summaryType;
    return {
      ...fieldOption,
      ...dimensionOption
    };
  }

  if (type === 'MEA') {
    delete fieldOption?.sortBy;
    delete fieldOption?.sortOrder;
    return {
      ...fieldOption,
      ...measureOption
    };
  }
};

// DataFieldType에 따른 meta.dataField의 option 값들 설정
// meta.dataField 설정
const metaDataField = {
  [DataFieldType.FIELD]: fieldOption
};

/**
 * 한 item 의 meta.dataField.category 생성
 * @param {JSON} defaultMetaDataField meta.dataField 의 기본값 (tempField)
 * @param {JSON} category meta.dataField 의 종류 (ex row, col, field ...)
 * @return {JSON} 기본값과 category 에 따른 dataField 속성값 반환
 */
const makeMetaDataField = (defaultMetaDataField, category) => {
  return {
    ...defaultMetaDataField,
    ...metaDataField[category]
  };
};

export {
  metaDataField,
  makeMetaDataField,
  makeFieldOption
};
