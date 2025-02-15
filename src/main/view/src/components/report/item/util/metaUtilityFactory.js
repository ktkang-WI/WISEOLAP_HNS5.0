import {paletteCollection}
  from 'components/common/atomic/Popover/organism/Palette';
import ItemManager from './ItemManager';
import {DataFieldType, dataFieldTypeOfItemTypeFunc} from './dataFieldType';
// 추후 사용 예정.
// import localizedString from 'config/localization';

// meta.dataField.dimension 설정
const getDimensionOption = (fieldOption) => {
  return {
    sortBy: fieldOption.name,
    sortOrder: 'ASC'
  };
};

// meta.dataField.measure 설정
const getMeasureOption = (fieldOption) => {
  const measureOption = {
    format: {},
    summaryType: fieldOption.fieldType == 'MEA' ? fieldOption?.summaryType ?
      fieldOption?.summaryType :'SUM' : 'MIN'
  };

  if (fieldOption.fieldType === 'DIM' && fieldOption.type === 'MEA') {
    measureOption.summaryType =
      measureOption.summaryType === 'MIN' ? 'COUNT' : measureOption.summaryType;

    if (fieldOption.summaryType) {
      measureOption.summaryType = fieldOption.summaryType;
    }
  }

  return measureOption;
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

/**
 * item.meta.dataField 데이터 초기화
 * @param {JSON} item 아이템 객체
 */
const initDataFieldMeta = (item) => {
  const dataFieldTypes = dataFieldTypeOfItemTypeFunc(item.type);
  dataFieldTypes.forEach((type) => item.meta.dataField[type] = []);
  item.meta.dataField[DataFieldType.SORT_BY_ITEM] = [];
};

/**
 * 비정형 아이템의 meta값 세팅
 * @param {JSON} orgItem 아이템 객체
 * @return {JSON} 생성된 비정형 아이템의 meta 정보
 */
const makeAdHocItemMeta = (orgItem) => {
  // 임시용.
  const type = {chart: '차트', pivot: '피벗'};
  orgItem.meta = {};
  ItemManager.generateMeta(orgItem);
  // localizedString 사용 추후에 현재는 활용이 힘듬.
  return {
    name: type[orgItem.type],
    memo: '',
    paletteType: 'palette',
    palette: paletteCollection[orgItem?.palette || 0],
    colorEdit: [],
    useCaption: true,
    ...orgItem.meta
  };
};

/* item > meta에 데이터 추가.
 * @param {*} item 현재 선택된 item을 가져옴.(파이차트의 meta, mart 등, 일반차트의 meta, mart 등)
 * @param {*} id meta에 추가된 값 (itemOption : ex(pieStyle, labelEdit 등))
 * @param {*} data meta에 추가될 데이터 ('pieChartStyle': 'pie' 등)
 */
const setMeta = (item, id, data) => {
  if (typeof item.meta[id] == 'undefined' || typeof item.meta[id] == 'null') {
    item.meta[id] = data;
  }
};

export {
  metaDataField,
  makeMetaDataField,
  makeFieldOption,
  initDataFieldMeta,
  makeAdHocItemMeta,
  setMeta
};
