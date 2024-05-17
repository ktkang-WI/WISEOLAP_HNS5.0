import localizedString from 'config/localization';

/**
 * ribbon 버튼에서 사용되는 form 렌더링에 필요한 데이터 소스들을 일괄 리턴합니다.
 * @param {*} item 현재 focus된 아이템
 * @return {JSONArray} formItems
 */
const getFormItems = (item) => {
  return {
    'initState': [
      {
        id: 'expandColumnGroup',
        text: localizedString.expandColumnGroup,
        value: item.meta.positionOption.column.expand
      },
      {
        id: 'expandRowGroup',
        text: localizedString.expandRowGroup,
        value: item.meta.positionOption.row.expand
      }
    ],
    'total': [
      {
        id: 'showColumnTotal',
        text: localizedString.showColumnTotal,
        value: item.meta.positionOption.column.totalVisible
      },
      {
        id: 'showRowTotal',
        text: localizedString.showRowTotal,
        value: item.meta.positionOption.row.totalVisible
      }
    ],
    'grandTotal': [
      {
        id: 'showColumnGrandTotal',
        text: localizedString.showColumnGrandTotal,
        value: item.meta.positionOption.column.grandTotalVisible
      },
      {
        id: 'showRowGrandTotal',
        text: localizedString.showRowGrandTotal,
        value: item.meta.positionOption.row.grandTotalVisible
      }
    ],
    'layout': [
      {
        id: 'standard',
        text: localizedString.standardLayout
      },
      {
        id: 'tree',
        text: localizedString.treeLayout
      }
    ],
    'autoSize': [
      {
        id: 'autoSize',
        text: localizedString.autoSize,
        value: item.meta.autoSize
      }
    ],
    'rowTotalPosition': [
      {
        id: 'top',
        text: localizedString.top
      },
      {
        id: 'bottom',
        text: localizedString.bottom
      }
    ],
    'columnTotalPosition': [
      {
        id: 'left',
        text: localizedString.left
      },
      {
        id: 'right',
        text: localizedString.right
      }
    ],
    'dataPosition': [
      {
        id: 'row',
        text: localizedString.row
      },
      {
        id: 'column',
        text: localizedString.column
      }
    ],
    'removeNullData': [
      {
        id: 'removeNullData',
        text: localizedString.removeNullData,
        value: item.meta.removeNullData
      }
    ],
    'showFilter': [
      {
        id: 'showFilter',
        text: localizedString.showFilter,
        value: item.meta.showFilter
      }
    ]
  };
};

export default {
  getFormItems
};
