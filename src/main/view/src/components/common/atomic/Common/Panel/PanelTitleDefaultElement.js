import customFieldImg from 'assets/image/icon/button/custom_field.png';
import modifyImg from 'assets/image/icon/button/modify.png';
import removeImg from 'assets/image/icon/button/remove.png';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import store from 'redux/modules';
import {selectCurrentDataset} from 'redux/selector/DatasetSelector';
import DatasetType from 'components/dataset/utils/DatasetType';
import models from 'models';
import DatasetSlice from 'redux/modules/DatasetSlice';
import ItemSlice from 'redux/modules/ItemSlice';
import ParameterSlice from 'redux/modules/ParameterSlice';
import {useDispatch} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectRootParameter} from 'redux/selector/ParameterSelector';
import QueryDataSourceDesignerModal
  from 'components/dataset/modal/QueryDataSourceDesignerModal';
import EditParamterModal from 'components/dataset/modal//EditParamterModal';

const PanelTitleDefaultElement = () => {
  const {openModal, alert, confirm} = useModal();
  const dispatch = useDispatch();
  const {deleteDataset} = DatasetSlice.actions;
  const {deleteParameterByDatsetId,
    updateParameterInformation
  } = ParameterSlice.actions;
  const {initItemByDatsetId} = ItemSlice.actions;

  return {
    CustomField: {
      id: 'custom_field',
      onClick: () => {
      },
      src: customFieldImg,
      label: localizedString.addCustomField,
      imgWidth: '14px'
    },
    DataSourceModify: {
      id: 'data_source_modify',
      onClick: async () => {
        const dataset = selectCurrentDataset(store.getState());
        const reportId = selectCurrentReportId(store.getState());

        if (!dataset) {
          alert(localizedString.datasetNotSelected);
          return;
        }

        if (dataset.datasetType == DatasetType.DS_SQL) {
          const dataSourceRes = await models.
              DataSource.getByDsId(dataset.dataSrcId);
          const dataSource = dataSourceRes.data;

          openModal(QueryDataSourceDesignerModal,
              {selectedDataSource: dataSource, orgDataset: dataset}
          );
        } else if (dataset.datasetType == DatasetType.CUBE) {
          const cubeParameters = selectRootParameter(store.getState());
          const cubeParamInfo = cubeParameters.informations;
          openModal(EditParamterModal, {
            parameterInfo: cubeParamInfo,
            onSubmit: (p) => {
              dispatch(updateParameterInformation({
                datasetId: dataset.datasetId,
                reportId: reportId,
                informations: p
              }));
            }
          });
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
