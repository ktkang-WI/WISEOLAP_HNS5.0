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
import DataHighLightModal
  from 'components/report/item/pivot/modal/organism/DataHighLightModal';


const ItemAttributeDefaultElement = () => {
  const {openModal} = useModal();
  return {
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
        {
          id: 'singleMasterFilter',
          label: localizedString.singleMasterFilter,
          icon: singleMasterFilterImg
        },
        {
          id: 'multiMasterFilter',
          label: localizedString.multiMasterFilter,
          icon: multiMaseterFilterImg
        },
        {
          id: 'drillDown',
          label: localizedString.drillDown,
          icon: drillDownImg
        }
      ]
    },
    InteractionNoDrillDown: {
      title: localizedString.interaction,
      items: [
        {
          id: 'singleMasterFilter',
          label: localizedString.singleMasterFilter,
          icon: singleMasterFilterImg
        },
        {
          id: 'multiMasterFilter',
          label: localizedString.multiMasterFilter,
          icon: multiMaseterFilterImg
        }
      ]
    },
    InteractionConfiguration: {
      title: localizedString.interactionConfiguration,
      items: [
        {
          id: 'crossDataSourceFiltering',
          label: localizedString.crossDataSourceFiltering,
          icon: crossDataSourceFilteringImg
        },
        {
          id: 'ignoreMasterFilterImg',
          label: localizedString.ignoreMasterFilter,
          icon: ignoreMasterFilterImg
        }
      ]
    },
    TargetDimension: {
      title: localizedString.targetDimension,
      items: [
        {
          id: 'dimension',
          label: localizedString.dimension,
          icon: dimensionImg
        },
        {
          id: 'dimensionGroup',
          label: localizedString.dimensionGroup,
          icon: dimensionGroupImg
        },
        {
          id: 'dimensionGroup',
          label: '데이터하이라이트 테스트',
          icon: dimensionGroupImg,
          onClick: () => {
            openModal(DataHighLightModal);
          }
        }
      ]
    }
  };
};

export default ItemAttributeDefaultElement;
