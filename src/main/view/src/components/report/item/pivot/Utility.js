import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

/**
 * 아이템 객체를 기반으로 아이템 조회에 필요한 옵션 생성
 * @param {*} item 옵션을 삽입할 아이템 객체
 * @param {*} data 조회된 데이터
 */
const generateItem = (item, data) => {
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
      sortBy: 'none'
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

  param.dimension = JSON.stringify(param.dimension);
  param.measure = JSON.stringify(param.measure);
};

export default {
  generateItem,
  generateParameter
};
