import localizedString from 'config/localization';
import filteringImg from 'assets/image/icon/report/filter.png';
import resetFilterImg from 'assets/image/icon/report/reset_filter.png';
import singleMasterFilterImg
  from 'assets/image/icon/report/single_master_filter.png';
import multiMaseterFilterImg
  from 'assets/image/icon/report/multi_master_filter.png';
import drillDownImg from 'assets/image/icon/report/drill_down.png';
import crossDataSourceFilteringImg
  from 'assets/image/icon/report/cross_data_source_filtering.png';
import ignoreMasterFilterImg
  from 'assets/image/icon/report/ignore_master_filter.png';
import dimensionImg from 'assets/image/icon/report/dimension.png';
import dimensionGroupImg
  from 'assets/image/icon/report/dimension_group.png';
import deltaValueImg from 'assets/image/icon/adhoc/deltaValue.png';
import dataHighlightImg from 'assets/image/icon/adhoc/dataHighlight.png';
import gridAttributeImg from 'assets/image/icon/adhoc/gridAttribute.png';
import useModal from 'hooks/useModal';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentItem, selectRootItem} from 'redux/selector/ItemSelector';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import useQueryExecute from 'hooks/useQueryExecute';
// import TopBottomModal from '../modal/TopBottomModal';
// eslint-disable-next-line max-len
import DataHighlightModal from 'components/report/item/pivot/modal/organism/datahighlight/DataHighLightModal';
import GridAttributeModal
  from 'components/report/item/pivot/modal/organism/GridAttributeModal';
import VariationValueModal
  from 'components/report/item/pivot/modal/organism/VariationValueModal';
import DataFilterModal
  from
  'components/report/item/pivot/modal/organism/dataFiltering/DataFilterModal';


const ItemAttributeDefaultElement = () => {
  const dispatch = useDispatch();
  const focusedItem = useSelector(selectCurrentItem);
  const rootItem = useSelector(selectRootItem);
  const reportId = useSelector(selectCurrentReportId);
  const {updateInteractiveOption} = ItemSlice.actions;
  const {filterItem} = useQueryExecute();
  const {openModal} = useModal();

  const MASTER_FILTER_MODE = {
    SINGLE: 'single',
    MULTIPLE: 'multiple'
  };
  const option = focusedItem?.meta.interactiveOption || {};

  const masterFilterEvent = (mode) => {
    let enabled = true;

    if (option.enabled && option.mode == mode) {
      enabled = false;
    }

    dispatch(updateInteractiveOption({reportId, option: {enabled, mode}}));
  };

  const masterFilters = [{
    id: 'singleMasterFilter',
    label: localizedString.singleMasterFilter,
    active: option.enabled && option.mode == MASTER_FILTER_MODE.SINGLE,
    icon: singleMasterFilterImg,
    onClick: () => {
      masterFilterEvent(MASTER_FILTER_MODE.SINGLE);
    }
  },
  {
    id: 'multiMasterFilter',
    active: option.enabled && option.mode == MASTER_FILTER_MODE.MULTIPLE,
    label: localizedString.multiMasterFilter,
    icon: multiMaseterFilterImg,
    onClick: () => {
      masterFilterEvent(MASTER_FILTER_MODE.MULTIPLE);
    }
  }];

  return {
    // TODO: 추후 필터 편집 기능 추가시 onClick 이벤트 추가
    Filtering: {
      title: localizedString.filtering,
      items: [
        {
          id: 'editFilter',
          label: localizedString.editFilter,
          icon: filteringImg
        },
        {
          id: 'resetFilter',
          label: localizedString.resetFilter,
          icon: resetFilterImg
        }
      ]
    },
    Interaction: {
      title: localizedString.interaction,
      items: [
        ...masterFilters,
        {
          id: 'drillDown',
          label: localizedString.drillDown,
          icon: drillDownImg
        }
      ]
    },
    InteractionNoDrillDown: {
      title: localizedString.interaction,
      items: masterFilters
    },
    InteractionSingleMasterFilter: {
      title: localizedString.interaction,
      items: [masterFilters[0]]
    },
    InteractionConfiguration: {
      title: localizedString.interactionConfiguration,
      items: [
        {
          id: 'crossDataSourceFiltering',
          label: localizedString.crossDataSourceFiltering,
          active: option.crossDataSource,
          icon: crossDataSourceFilteringImg,
          onClick: () => {
            const crossDataSource = !option.crossDataSource;

            dispatch(updateInteractiveOption({
              reportId, option: {crossDataSource}
            }));
          }
        },
        {
          id: 'ignoreMasterFilter',
          label: localizedString.ignoreMasterFilter,
          active: option.ignoreMasterFilter,
          icon: ignoreMasterFilterImg,
          onClick: () => {
            const ignoreMasterFilter = !option.ignoreMasterFilter;

            const tempItem = {
              ...focusedItem,
              meta: {
                ...focusedItem.meta,
                interactiveOption: {
                  ...option,
                  ignoreMasterFilter
                }
              }
            };

            filterItem(tempItem,
              ignoreMasterFilter ? {} : focusedItem.mart.filter);
          }
        },
        {
          id: 'onlyWithFilter',
          label: localizedString.onlyWithFilter,
          active: option.onlyWithFilter,
          icon: ignoreMasterFilterImg,
          onClick: () => {
            const onlyWithFilter = !option.onlyWithFilter;

            dispatch(updateInteractiveOption({
              reportId, option: {onlyWithFilter}
            }));
          }
        }
      ]
    },
    TargetDimension: {
      title: localizedString.targetDimension,
      items: [
        {
          id: 'dimension',
          label: localizedString.dimension,
          active: option.targetDimension == 'dimension',
          icon: dimensionImg,
          onClick: () => {
            const targetDimension = 'dimension';

            dispatch(updateInteractiveOption({
              reportId, option: {targetDimension}
            }));
          }
        },
        {
          id: 'dimensionGroup',
          label: localizedString.dimensionGroup,
          icon: dimensionGroupImg,
          active: option.targetDimension == 'dimensionGroup',
          onClick: () => {
            const targetDimension = 'dimensionGroup';

            dispatch(updateInteractiveOption({
              reportId, option: {targetDimension}
            }));
          }
        }
      ]
    },
    DashAnyPivotOption: {
      title: '피벗그리드 옵션',
      items: [
        {
          id: 'dataHighlight',
          label: localizedString.dataHighlight,
          icon: dataHighlightImg,
          active: option.dataHighlight == 'dataHighlight',
          onClick: () => {
            const pivotMartInit = focusedItem.mart.init;

            if (!pivotMartInit) {
              return;
            }

            openModal(DataHighlightModal);
          }
        }
      ]
    },
    AdHocOptions: {
      title: '비정형 옵션',
      items: [
        {
          id: 'dataHighlight',
          label: localizedString.dataHighlight,
          icon: dataHighlightImg,
          active: option.dataHighlight == 'dataHighlight',
          width: '50%',
          onClick: () => {
            const chartMartInit = rootItem.items[0].mart.init;
            const pivotMartInit = rootItem.items[1].mart.init;

            if (!chartMartInit && !pivotMartInit) {
              return;
            }

            openModal(DataHighlightModal);
          }
        },
        // {
        //   id: 'topBottom',
        //   label: localizedString.topBottom,
        //   icon: topBottomImg,
        //   active: option.topBottom == 'topBottom',
        //   width: '50%',
        //   onClick: () => {
        //     const dataField = rootItem.adHocOption.dataField;
        //     if (dataField.measure.length === 0) {
        //       return;
        //     }

        // eslint-disable-next-line max-len
        //     if (dataField.row.length === 0 && dataField.column.length === 0) {
        //       return;
        //     }

        //     openModal(TopBottomModal, {
        //       topBottomInfo: rootItem.adHocOption.topBottomInfo
        //     });
        //   }
        // },
        {
          id: 'gridAttribute',
          label: localizedString.gridAttribute,
          icon: gridAttributeImg,
          active: option?.gridAttribute == 'gridAttribute',
          width: '50%',
          onClick: () => {
            // TODO: Get Grid Attribute List
            const gridAttribute = rootItem?.adHocOption?.gridAttribute;
            const dataField = rootItem?.adHocOption?.dataField;
            openModal(GridAttributeModal, {
              dataField: dataField,
              gridAttribute: gridAttribute
            });
          }
        },
        // TODO: 기능 개발 후 활성화
        {
          id: 'deltaValue',
          label: '변동 측정값',
          active: option?.deltaValue == 'deltaValue',
          icon: deltaValueImg,
          width: '50%',
          onClick: () => {
            // 피벗그리드 데이터를 가져와야 변동 측정값 실행 되게.
            // TODO : 홈앤쇼핑 브랜치와 같이 피벗만 보기시 차트 데이터는 안가져오게(피벗데이터만 가져옴).
            const pivotMartInit = rootItem.items[1].mart.init;

            if (!pivotMartInit) {
              return;
            }

            openModal(VariationValueModal, {itemId: rootItem.items[1].id});
          }
        },
        {
          id: 'dataFiltering',
          label: '데이터 필터링',
          active: option?.dataFilter == 'dataFilter',
          icon: dataHighlightImg,
          width: '50%',
          onClick: () => {
            // const chartMartInit = rootItem.items[0].mart.init;
            const pivotMartInit = rootItem.items[1].mart.init;
            // !chartMartInit &&
            if (!pivotMartInit) {
              return;
            }

            openModal(DataFilterModal);
          }
        }
      ]
    }
  };
};

export default ItemAttributeDefaultElement;
