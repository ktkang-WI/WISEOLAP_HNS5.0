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
    case ItemType.CHART: {
      dataFieldFormat.push(DataFieldType.DIMENSION_GROUP);
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
