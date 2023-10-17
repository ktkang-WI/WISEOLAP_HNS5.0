import localizedString from 'config/localization';
import chartSeriesButtonIcon from 'assets/image/icon/item/chart_bar.png';
import dimensionIcon from 'assets/image/icon/dataSource/dimension.png';
import measureIcon from 'assets/image/icon/dataSource/measure.png';


const setItem = (orgItem) => {
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
          dataFieldQuantity: 0,
          measure: []
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

  // mart 및 meta 값 세팅
  switch (item.type) {
    case 'chart':
      const mart = {
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
          }
        },
        ribbonItem: []
      };

      item = {
        ...item,
        meta: {
          ...item.meta,
          dataField: {
            ...item.meta.dataField,
            dimension: []
          }
        },
        mart: mart
      };
      break;
    default:
      break;
  }

  return item;
};

export {setItem};
