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
  ],
  [ItemType.CHOROPLETH]: [
    DataFieldType.MEASURE,
    DataFieldType.DIMENSION
  ],
  [ItemType.TREEMAP]: [
    DataFieldType.MEASURE,
    DataFieldType.DIMENSION
  ],
  [ItemType.LIQUID_GAUGE]: [
    DataFieldType.MEASURE,
    DataFieldType.DIMENSION
  ],
  [ItemType.CARD]: [
    DataFieldType.MEASURE,
    DataFieldType.DIMENSION
  ]
};

export {
  DataFieldType,
  DataFieldTypeOfItemType
};
