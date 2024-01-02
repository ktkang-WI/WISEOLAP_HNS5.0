import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

/**
 * 아이템 객체에 meta 기본 데이터를 세팅합니다.
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const generateMeta = (item) => {
  const setMeta = (id, data) => {
    if (!item.meta[id]) {
      item.meta[id] = data;
    }
  };

  setMeta('positionOption', {
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

  setMeta('layout', 'standard');
  setMeta('removeNullData', false);
  setMeta('showFilter', false);
};

/**
 * 아이템 객체를 기반으로 아이템 조회에 필요한 옵션 생성
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const generateItem = (item) => {
  const fields = [];
  const metaFields = item.meta.dataField;

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
      area: 'row',
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
      area: 'column',
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

export default {
  generateMeta,
  generateItem,
  generateParameter,
  getRibbonItems
};
