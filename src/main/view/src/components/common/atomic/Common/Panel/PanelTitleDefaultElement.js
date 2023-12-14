import customFieldImg from 'assets/image/icon/button/custom_field.png';
import modifyImg from 'assets/image/icon/button/modify.png';
import removeImg from 'assets/image/icon/button/remove.png';
import QueryDataSourceDesignerModal
  from 'components/dataset/modal/QueryDataSourceDesignerModal';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import store from 'redux/modules';
import {selectCurrentDataset} from 'redux/selector/DatasetSelector';
import DatasetType from 'components/dataset/utils/DatasetType';
import models from 'models';
import UserDefinedDataModal
  from 'components/dataset/modal/CustomData/CustomDataModal';

const PanelTitleDefaultElement = () => {
  const {openModal, alert} = useModal();
  return {
    CustomField: {
      id: 'custom_field',
      onClick: () => {
        console.log('눌렸어요!');
        openModal(UserDefinedDataModal);
      },
      src: customFieldImg,
      label: localizedString.addCustomField,
      imgWidth: '14px'
    },
    DataSourceModify: {
      id: 'data_source_modify',
      onClick: async () => {
        const dataset = selectCurrentDataset(store.getState());

        if (!dataset) {
          alert(localizedString.datasetNotSelected);
          return;
        }

        if (dataset.datasetType == DatasetType.DS_SQL) {
          const dataSource = await models.
              DataSource.getByDsId(dataset.dataSrcId);

          openModal(QueryDataSourceDesignerModal,
              {selectedDataSource: dataSource, orgDataset: dataset}
          );
        }
      },
      src: modifyImg,
      label: localizedString.dataSourceModify
    },
    DataSourceRemove: {
      id: 'data_source_remove',
      onClick: () => {
        console.log('눌렸어요!3');
      },
      src: removeImg,
      label: localizedString.dataSourceRemove
    }
  };
};

export default PanelTitleDefaultElement;
