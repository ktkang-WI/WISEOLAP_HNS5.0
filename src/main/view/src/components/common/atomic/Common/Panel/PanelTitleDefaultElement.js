import customFieldImg from 'assets/image/icon/button/custom_field.png';
import modifyImg from 'assets/image/icon/button/modify.png';
import removeImg from 'assets/image/icon/button/remove.png';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import store from 'redux/modules';
import {selectCurrentDataset} from 'redux/selector/DatasetSelector';
import DatasetType from 'components/dataset/utils/DatasetType';
import models from 'models';
import UserDefinedDataModal
  from 'components/dataset/modal/CustomData/CustomDataModal';
import DatasetSlice from 'redux/modules/DatasetSlice';
import ItemSlice from 'redux/modules/ItemSlice';
import ParameterSlice from 'redux/modules/ParameterSlice';
import {useDispatch} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import QueryDataSourceDesignerModal
  from 'components/dataset/modal/QueryDataSourceDesignerModal';

const PanelTitleDefaultElement = () => {
  const {openModal, alert, confirm} = useModal();
  const dispatch = useDispatch();
  const {deleteDataset} = DatasetSlice.actions;
  const {deleteParameterByDatsetId} = ParameterSlice.actions;
  const {initItemByDatsetId} = ItemSlice.actions;

  return {
    CustomField: {
      id: 'custom_field',
      onClick: () => {
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
        const dataset = selectCurrentDataset(store.getState());
        const reportId = selectCurrentReportId(store.getState());
        confirm('데이터 집합을 삭제하시겠습니까?', () => {
          const datasetId = dataset.datasetId;
          dispatch(deleteDataset({datasetId, reportId}));
          dispatch(deleteParameterByDatsetId({reportId, datasetId}));
          dispatch(initItemByDatsetId({reportId, datasetId}));
        });
      },
      src: removeImg,
      label: localizedString.dataSourceRemove
    }
  };
};

export default PanelTitleDefaultElement;
