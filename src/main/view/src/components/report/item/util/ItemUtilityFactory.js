import ItemType from './ItemType';
import ChartUtility from '../chart/Utility';
import PivotUtility from '../pivot/Utility';
import GridUtility from '../grid/Utility';

export default {
  [ItemType.CHART]: ChartUtility,
  [ItemType.PIVOT_GRID]: PivotUtility,
  [ItemType.DATA_GRID]: GridUtility
};
