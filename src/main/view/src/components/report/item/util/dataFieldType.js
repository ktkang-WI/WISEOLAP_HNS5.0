import ItemType from './ItemType';

const DataFieldType = {
  MEASURE: 'measure',
  DIMENSION: 'dimension',
  DIMENSION_GROUP: 'dimensionGroup',
  COLUMN: 'column',
  ROW: 'row',
  FIELD: 'field',
  SPARKLINE: 'sparkline',
  SORT_BY_ITEM: 'sortByItem'
};

const DataFieldTypeOfItemType = {
  [ItemType.CHART]: [
    DataFieldType.MEASURE,
    DataFieldType.DIMENSION,
    DataFieldType.DIMENSION_GROUP
  ],
  [ItemType.PIVOT_GRID]: [
    DataFieldType.MEASURE,
    DataFieldType.ROW,
    DataFieldType.COLUMN],
  [ItemType.DATA_GRID]: [
    DataFieldType.FIELD,
    DataFieldType.SPARKLINE
  ],
  [ItemType.PIE_CHART]: [
    DataFieldType.MEASURE,
    DataFieldType.DIMENSION,
    DataFieldType.DIMENSION_GROUP
  ]
};

export {
  DataFieldType,
  DataFieldTypeOfItemType
};
