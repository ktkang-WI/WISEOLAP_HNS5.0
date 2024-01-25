import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import {setMeta} from '../util/metaUtilityFactory';
import {defaultDimension, defaultMeasure}
  from 'components/report/item/util/martUtilityFactory';
import localizedString from 'config/localization';
import {DataFieldType} from '../util/dataFieldType';

/**
 * 아이템 객체에 meta 기본 데이터를 세팅합니다.
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const generateMeta = (item) => {
  setMeta(item, 'positionOption', {
    column: {
      totalVisible: true, // 열 합계 표시
      grandTotalVisible: true, // 열 총 합계 표시
      position: 'left', // 열 합계 위치
      expand: true // 열 그룹 확장(초기상태)
    },
    row: {
      totalVisible: true, // 행 합계 표시
      grandTotalVisible: true, // 행 총 합계 표시
      position: 'top', // 행 합계 위치
      expand: true // 행 그룹 확장(초기상태)
    },
    dataPosition: 'row' // 측정값 위치
  });

  setMeta(item, 'layout', 'standard');
  setMeta(item, 'removeNullData', false);
  setMeta(item, 'showFilter', false);
};

/**
 * 아이템 객체를 기반으로 아이템 조회에 필요한 옵션 생성
 * @param {*} item 옵션을 삽입할 아이템 객체
 * @param {*} rootItem root item
 */
const generateItem = (item, rootItem) => {
  const fields = [];
  const metaFields = item.meta.dataField || rootItem.adHocOption.dataField;

  const allMeasure = metaFields.measure.concat(metaFields.sortByItem);
  const getMeasureByFieldId = allMeasure.reduce((acc, data) => {
    acc[data.fieldId] = data;
    return acc;
  }, {});

  for (const field of metaFields.measure) {
    fields.push({
      caption: field.caption,
      summaryType: 'sum',
      dataField: field.summaryType + '_' + field.name,
      area: 'data'
    });
  }

  for (const field of metaFields.sortByItem) {
    fields.push({
      caption: field.caption,
      summaryType: 'sum',
      dataField: field.summaryType + '_' + field.name,
      area: 'data',
      visible: false
    });
  }

  for (const field of metaFields.row) {
    fields.push({
      caption: field.caption,
      dataField: field.name,
      area: item.meta.colRowSwitch? 'column' : 'row',
      sortBy: 'none',
      expanded: item.meta.positionOption.row.expand
    });
  }

  for (const field of metaFields.column) {
    let sortBy = {};

    if (field.sortBy && field.sortBy != field.fieldId) {
      const target = getMeasureByFieldId[field.sortBy];

      if (target) {
        sortBy = {
          sortBySummaryField: target.summaryType + '_' + target.name
        };
      } else {
        sortBy = {
          sortBy: field.name
        };
      }
    } else {
      sortBy = {
        sortBy: field.name
      };
    }

    fields.push({
      caption: field.caption,
      dataField: field.name,
      area: item.meta.colRowSwitch? 'row' : 'column',
      sortOrder: field.sortOrder.toLowerCase(),
      expanded: item.meta.positionOption.column.expand,
      ...sortBy
    });
  }

  item.mart.dataSourceConfig = new PivotGridDataSource({
    fields: fields,
    store: item.mart.data.data
  });
};

/**
 * 아이템 객체의 데이터 항목 옵션
 * @return {JSON} dataFieldOption
 */
const getDataFieldOptionChild = () => {
  const dataFieldMeasure = {
    ...defaultMeasure
  };

  const dataFieldColumn = {
    ...defaultDimension,
    label: localizedString.column,
    placeholder: localizedString.columnPlaceholder
  };

  const dataFieldRow = {
    ...defaultDimension,
    label: localizedString.row,
    placeholder: localizedString.rowPlaceholder
  };

  return {
    [DataFieldType.MEASURE]: dataFieldMeasure,
    [DataFieldType.ROW]: dataFieldRow,
    [DataFieldType.COLUMN]: dataFieldColumn
  };
};

/**
 * 차트 커스텀 파라미터 삽입
 * @param {JSON} item 아이템 객체
 * @param {JSON} param 파라미터 정보를 삽입할 객체
 */
const generateParameter = (item, param) => {
  const dataField = item.meta.dataField;
  param.dimension = dataField.row.concat(dataField.column);
  param.measure = dataField.measure;
  param.removeNullData = item.meta.removeNullData;

  param.dimension = JSON.stringify(param.dimension);
  param.measure = JSON.stringify(param.measure);
};

/**
 * 리본 영역 아이템 배열을 반환합니다.
 * @return {Array} ribbonItems
 */
const getRibbonItems = () => {
  return [
    'CaptionView',
    'NameEdit',
    'InitState',
    'Total',
    'GrandTotal',
    'Layout',
    'RowTotalPosition',
    'ColumnTotalPosition',
    'DataPosition',
    'RemoveNullData',
    'ShowFilter',
    'EditText'
  ];
};

/**
 * 속셩 영역 아이템 배열을 반환합니다.
 * @return {Array} attributeItems
 */
const getAttributeItems = () => {
  return [
    'InteractionConfiguration'
  ];
};

const getTabHeaderItems = () => {
  // TODO: 추후 그리드로 보기 비정형일 때만 보이게 수정해야 함.
  return ['ColRowSwitch', 'ShowGrid'];
};

export default {
  generateMeta,
  generateItem,
  getDataFieldOptionChild,
  generateParameter,
  getRibbonItems,
  getAttributeItems,
  getTabHeaderItems
};
