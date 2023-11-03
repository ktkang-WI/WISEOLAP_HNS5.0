import localizedString from 'config/localization';
import chartSeriesButtonIcon from 'assets/image/icon/item/chart_bar.png';
import dimensionIcon from 'assets/image/icon/dataSource/dimension.png';
import measureIcon from 'assets/image/icon/dataSource/measure.png';
import ItemType from './ItemType';

/**
 * 아이템의 meta값을 가지고 mart를 세팅
 * @param {*} orgItem 아이템 객체
 * @return {JSON} 생성된 아이템 객체
 */
const makeItem = (orgItem) => {
  let item = {};
  // meta 값 있는 경우 불러오기로 간주
  if (!orgItem.meta) {
    // 기본 값 세팅
    item = {
      ...orgItem,
      meta: {
        name: '아이템',
        memo: '',
        useCaption: true,
        dataField: {
          dataFieldQuantity: 0
        }
      }
    };
  }

  const defaultDimension = {
    label: localizedString.dimension,
    icon: dimensionIcon,
    placeholder: localizedString.dimensionPlaceholder,
    type: 'DIM'
  };

  const defaultMesarue = {
    label: localizedString.measure,
    icon: measureIcon,
    placeholder: localizedString.measurePlaceholder,
    type: 'MEA'
  };

  const defaultMart = {
    data: [],
    init: false
  };

  // mart 및 meta 값 세팅
  if (item.type == ItemType.CHART) {
    const mart = {
      ...defaultMart,
      dataFieldOption: {
        measure: {
          ...defaultMesarue,
          useButton: true,
          // 우측에 버튼 추가가 필요한 경우 사용하는 옵션 ex)시리즈 옵션
          buttonIcon: chartSeriesButtonIcon,
          buttonEvent: function(e) {
            console.log(e);
          }
        },
        dimension: {
          ...defaultDimension
        },
        dimensionGroup: {
          ...defaultDimension,
          label: localizedString.dimensionGroup,
          placeholder: localizedString.dimensionGroupPlaceholder

        }
      },
      ribbonItem: []
    };

    item.mart = mart;

    if (!orgItem.meta) {
      item.meta.dataField.measure = [];
      item.meta.dataField.dimension = [];
      item.meta.dataField.dimensionGroup = [];
    }
  } else if (item.type == ItemType.PIVOT_GRID) {
    const mart = {
      ...defaultMart,
      dataFieldOption: {
        measure: {
          ...defaultMesarue,
          useButton: true,
          // 우측에 버튼 추가가 필요한 경우 사용하는 옵션 ex)시리즈 옵션
          buttonIcon: chartSeriesButtonIcon,
          buttonEvent: function(e) {
            console.log(e);
          }
        },
        column: {
          ...defaultDimension,
          label: localizedString.column,
          placeholder: localizedString.columnPlaceholder
        },
        row: {
          ...defaultDimension,
          label: localizedString.row,
          placeholder: localizedString.rowPlaceholder
        }
      },
      ribbonItem: []
    };

    item.mart = mart;

    if (!orgItem.meta) {
      item.meta.dataField.measure = [];
      item.meta.dataField.column = [];
      item.meta.dataField.row = [];
    }
  } else if (item.type == ItemType.DATA_GRID) {
    const mart = {
      ...defaultMart,
      dataFieldOption: {
        field: {
          ...defaultDimension,
          label: localizedString.field,
          placeholder: localizedString.fieldPlaceholder
        },
        sparkline: {
          ...defaultDimension,
          label: localizedString.sparkline,
          placeholder: localizedString.sparklinePlaceholder
        }
      },
      ribbonItem: []
    };

    item.mart = mart;

    if (!orgItem.meta) {
      item.meta.dataField.field = [];
      item.meta.dataField.sparkline = [];
    }
  }

  return item;
};

export {makeItem};
