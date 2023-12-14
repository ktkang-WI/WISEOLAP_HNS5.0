import {DataFieldType} from 'components/report/item/util/dataFieldType';
import localizedString from 'config/localization';

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

/**
 * DataColumn의 contextMenu dataSource를 생성합니다.
 * @param {JSON} data DataColumn 데이터
 * @param {Array} sortItems 차원일 경우 Sort By에 들어가는 항목. 없을 경우 기본값 []
 * @return {JSON}
 */
export const getContextMenu = (data, sortItems = []) => {
  let obj = [];
  const type = data.type;
  const fieldType = data.fieldType;
  const category = data.category;

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


    obj = [...obj, sortBy, topN];
  }

  return [...obj, rename];
};
