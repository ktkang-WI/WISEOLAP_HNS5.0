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
import useModal from 'hooks/useModal';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentItem, selectRootItem} from 'redux/selector/ItemSelector';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import useQueryExecute from 'hooks/useQueryExecute';
import {pivotOptions} from './ItemAttributeUtils';


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
      items: pivotOptions(rootItem, focusedItem, openModal)
    },
    AdHocOptions: {
      title: '비정형 옵션',
      items: pivotOptions(rootItem, focusedItem, openModal)
    }
  };
};

export default ItemAttributeDefaultElement;
