import ItemType from 'components/report/item/util/ItemType';
import {DataFieldType} from 'components/report/item/util/dataFieldType';
import localizedString from 'config/localization';
import store from 'redux/modules';
import {selectCurrentReport} from 'redux/selector/ReportSelector';

const measureSummaryType = [
  {
    'text': localizedString.count,
    'value': 'COUNT',
    'type': 'SummaryType'
  },
  {
    'text': localizedString.distinctCount,
    'value': 'COUNTDISTINCT',
    'type': 'SummaryType'
  },
  {
    'text': localizedString.sum,
    'value': 'SUM',
    'type': 'SummaryType'
  },
  {
    'text': localizedString.min,
    'value': 'MIN',
    'type': 'SummaryType'
  },
  {
    'text': localizedString.max,
    'value': 'MAX',
    'type': 'SummaryType'
  },
  {
    'text': localizedString.average,
    'value': 'AVG',
    'type': 'SummaryType'
  }
];

const sortByItemSummaryType = [
  {
    'text': localizedString.min,
    'value': 'MIN',
    'type': 'SummaryType'
  },
  {
    'text': localizedString.max,
    'value': 'MAX',
    'type': 'SummaryType'
  },
  {
    'text': localizedString.count,
    'value': 'COUNT',
    'type': 'SummaryType'
  },
  {
    'text': localizedString.distinctCount,
    'value': 'COUNTDISTINCT',
    'type': 'SummaryType'
  }
];

const dimensionSummaryType = [
  {
    'text': localizedString.count,
    'value': 'COUNT',
    'type': 'SummaryType'
  },
  {
    'text': localizedString.distinctCount,
    'value': 'COUNTDISTINCT',
    'type': 'SummaryType'
  }
];

const rename = {
  'text': localizedString.rename,
  'value': 'RENAME',
  'type': 'Rename'
};

const format = {
  'text': localizedString.format,
  'value': 'FORMAT',
  'type': 'Format'
};


const topN = {
  'text': localizedString.topN,
  'value': 'TOP_N',
  'type': 'TopN'
};

const summaryWay = {
  'text': '총계 별도 계산',
  'value': 'SUMMARY_WAY',
  'type': 'SummaryWay'
};

const TOP_N_ITEMS = [
  ItemType.CHART,
  ItemType.PIE_CHART,
  ItemType.DATA_GRID,
  ItemType.PIVOT_GRID
];

/**
 * DataColumn의 contextMenu dataSource를 생성합니다.
 * @param {string} itemType 아이템 타입
 * @param {JSON} data DataColumn 데이터
 * @param {Array} sortItems 차원일 경우 Sort By에 들어가는 항목. 없을 경우 기본값 []
 * @return {JSON}
 */
export const getContextMenu = (itemType, data, sortItems = []) => {
  let obj = [];
  const type = data.type;
  const fieldType = data.fieldType;
  const category = data.category;


  if (category === 'sortByItem') {
    if (type === 'MEA' && fieldType === 'MEA') {
      return [...measureSummaryType, rename];
    } else {
      return [...sortByItemSummaryType, rename];
    }
  };

  if (data?.expression) {
    const report = selectCurrentReport(store.getState());
    const reportType = report.options.reportType;
    if (itemType == ItemType.PIVOT_GRID || reportType == 'AdHoc') {
      return [format, summaryWay];
    }
    return [format];
  }

  if (type == 'MEA') {
    if (fieldType == 'DIM') {
      obj = [...obj, ...dimensionSummaryType];
    } else {
      obj = [...obj, ...measureSummaryType];
    }

    if (category != DataFieldType.SORT_BY_ITEM) {
      obj = [...obj, format];
    }
  } else if (type == 'DIM') {
    const sortBy = {
      'text': localizedString.sortBy,
      'items': [{
        text: 'Value',
        type: 'SortBy',
        value: data? data.fieldId : ''
      }].concat(sortItems)
    };

    obj = [...obj, sortBy];

    if (TOP_N_ITEMS.includes(itemType)) {
      obj.push(topN);
    }
  }

  return [...obj, rename];
};
