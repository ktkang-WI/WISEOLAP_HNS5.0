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

const dataFieldTypeOfItemTypeFunc = (type) => {
  const dataFieldFormat = [];

  switch (type) {
    case ItemType.DATA_GRID: {
      dataFieldFormat.push(DataFieldType.FIELD);
      dataFieldFormat.push(DataFieldType.SPARKLINE);
      break;
    }
    case ItemType.PIVOT_GRID: {
      dataFieldFormat.push(DataFieldType.MEASURE);
      dataFieldFormat.push(DataFieldType.ROW);
      dataFieldFormat.push(DataFieldType.COLUMN);
      break;
    }
    case ItemType.TIMELINE: {
      dataFieldFormat.push(DataFieldType.DIMENSION);
      dataFieldFormat.push(DataFieldType.DIMENSION_GROUP);
      dataFieldFormat.push(DataFieldType.START_DATE);
      dataFieldFormat.push(DataFieldType.END_DATE);
      break;
    }
    case ItemType.CHORD:
    case ItemType.ARC_DIAGRAM: {
      dataFieldFormat.push(DataFieldType.DIMENSION);
      break;
    }
    case ItemType.CHART: {
      dataFieldFormat.push(DataFieldType.DIMENSION_GROUP);
      dataFieldFormat.push(DataFieldType.MEASURE);
      dataFieldFormat.push(DataFieldType.DIMENSION);
      break;
    }
    default: {
      dataFieldFormat.push(DataFieldType.MEASURE);
      dataFieldFormat.push(DataFieldType.DIMENSION);
    }
  };
  return dataFieldFormat;
};

export {
  DataFieldType,
  dataFieldTypeOfItemTypeFunc
};
