import ItemType from './ItemType';

const DataFieldType = {
  MEASURE: 'measure',
  X: 'x',
  Y: 'y',
  RANGE1: 'range1',
  RANGE2: 'range2',
  START_DATE: 'start',
  END_DATE: 'end',
  DIMENSION: 'dimension',
  DIMENSION_GROUP: 'dimensionGroup',
  ROW: 'row',
  COLUMN: 'column',
  FIELD: 'field',
  SPARKLINE: 'sparkline',
  SORT_BY_ITEM: 'sortByItem'
};

const dataFieldTypeOfItemTypeFunc = (type) => {
  const dataFieldFormat = [];

  switch (type) {
    case ItemType.DATA_GRID:
    {
      dataFieldFormat.push(DataFieldType.FIELD);
      dataFieldFormat.push(DataFieldType.SPARKLINE);
      break;
    }
    case ItemType.PIVOT_GRID:
    {
      dataFieldFormat.push(DataFieldType.MEASURE);
      dataFieldFormat.push(DataFieldType.ROW);
      dataFieldFormat.push(DataFieldType.COLUMN);
      break;
    }
    case ItemType.TIMELINE:
    {
      dataFieldFormat.push(DataFieldType.DIMENSION);
      dataFieldFormat.push(DataFieldType.DIMENSION_GROUP);
      dataFieldFormat.push(DataFieldType.START_DATE);
      dataFieldFormat.push(DataFieldType.END_DATE);
      break;
    }
    case ItemType.CHORD_DIAGRAM:
    case ItemType.ARC_DIAGRAM: {
      dataFieldFormat.push(DataFieldType.DIMENSION);
      break;
    }
    case ItemType.HEAT_MAP:
    {
      dataFieldFormat.push(DataFieldType.X);
      dataFieldFormat.push(DataFieldType.Y);
      dataFieldFormat.push(DataFieldType.MEASURE);
      break;
    }
    case ItemType.SCATTER_PLOT:
    case ItemType.COORDINATE_LINE:
    case ItemType.COORDINATE_DOT:
      dataFieldFormat.push(DataFieldType.X);
      dataFieldFormat.push(DataFieldType.Y);
      dataFieldFormat.push(DataFieldType.DIMENSION);
    case ItemType.CHART:
    case ItemType.PIE_CHART:
    {
      dataFieldFormat.push(DataFieldType.DIMENSION_GROUP);
      dataFieldFormat.push(DataFieldType.MEASURE);
      dataFieldFormat.push(DataFieldType.DIMENSION);
      break;
    }
    case ItemType.RANGE_BAR:
    {
      dataFieldFormat.push(DataFieldType.RANGE1);
      dataFieldFormat.push(DataFieldType.RANGE2);
      dataFieldFormat.push(DataFieldType.DIMENSION);
      break;
    }
    case ItemType.SCHEDULER_COMPONENT:
    case ItemType.TEXT_BOX:
    {
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
