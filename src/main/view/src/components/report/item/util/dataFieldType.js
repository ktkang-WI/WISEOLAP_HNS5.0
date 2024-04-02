import ItemType from './ItemType';

const DataFieldType = {
  MEASURE: 'measure',
  DIMENSION: 'dimension',
  DIMENSION_GROUP: 'dimensionGroup',
  COLUMN: 'column',
  ROW: 'row',
  FIELD: 'field',
  SPARKLINE: 'sparkline',
  SORT_BY_ITEM: 'sortByItem',
  START_DATE: 'start',
  END_DATE: 'end'
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
  [ItemType.BOX_PLOT]: [
    DataFieldType.MEASURE,
    DataFieldType.DIMENSION
  ],
  [ItemType.CHORD_DIAGRAM]: [
    DataFieldType.DIMENSION
  ],
  [ItemType.ARC_DIAGRAM]: [
    DataFieldType.DIMENSION
  ],
  [ItemType.TIMELINE]: [
    DataFieldType.DIMENSION,
    DataFieldType.DIMENSION_GROUP,
    DataFieldType.START_DATE,
    DataFieldType.END_DATE
  ]
};

export {
  DataFieldType,
  DataFieldTypeOfItemType
};
