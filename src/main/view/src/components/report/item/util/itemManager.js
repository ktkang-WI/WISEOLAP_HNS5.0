import {generate as chartGenerate} from '../chart/Utility';
import ItemType from './ItemType';

export const generate = (item) => {
  // item mart 세팅 기본 처리
  item.mart.init = true;

  // item별 mart 추가 세팅팅
  if (item.type == ItemType.CHART) {
    return chartGenerate(item);
  }
};
