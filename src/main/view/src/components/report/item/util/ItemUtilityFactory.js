import ItemType from './ItemType';
import ChartUtility from '../chart/Utility';
import PivotUtility from '../chart/Utility';

export default {
  [ItemType.CHART]: ChartUtility,
  [ItemType.PIVOT_GRID]: PivotUtility
};
