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
import {selectRootParameter} from 'redux/selector/ParameterSelector';
import QueryDataSourceDesignerModal
  from 'components/dataset/modal/QueryDataSourceDesignerModal';
import EditParamterModal from 'components/dataset/modal//EditParamterModal';
import SingleTableDesignerModal
  from 'components/dataset/modal/SingleTableDesignerModal';

const PanelTitleDefaultElement = () => {
  const {openModal, alert, confirm} = useModal();
  const dispatch = useDispatch();
  const {deleteDataset} = DatasetSlice.actions;
  const {deleteParameterByDatasetId,
    updateParameterInformation
  } = ParameterSlice.actions;
  const {initItemByDatsetId} = ItemSlice.actions;

  return {
    CustomField: {
      id: 'custom_field',
      onClick: async () => {
        // TODO: 기존 직접쿼리입력 로직 Format 변경필요.
        const dataset = selectCurrentDataset(store.getState());
        if (!dataset) {
          alert(localizedString.datasetNotSelected);
          return;
        }
        if (dataset.datasetType == DatasetType.DS_SQL) {
          const dataSource = await models.
              DataSource.getByDsId(dataset.dataSrcId);

          openModal(UserDefinedDataModal,
              {selectedDataSource: dataSource, orgDataset: dataset});
        } else if (dataset.datasetType == 'CUBE') {
          alert('주제영역 사용자 정의 개발 예정');
        }
      },
      src: customFieldImg,
      label: localizedString.addCustomField
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
        } else if (dataset.datasetType == DatasetType.DS_SINGLE) {
          const dataSourceRes = await models.
              DataSource.getByDsId(dataset.dataSrcId);
          const dataSource = dataSourceRes.data;
          openModal(SingleTableDesignerModal,
              {
                selectedDataSource: dataSource,
                orgDataset: dataset,
                selectedTable: dataset.tableInfo,
                columns: dataset.columnList
              }
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

        if (!dataset) {
          alert(localizedString.datasetNotSelected);
          return;
        }

        confirm(localizedString.deleteDatasetMsg, () => {
          const datasetId = dataset.datasetId;
          dispatch(deleteDataset({datasetId, reportId}));
          dispatch(deleteParameterByDatasetId({reportId, datasetId}));
          dispatch(initItemByDatsetId({reportId, datasetId}));
        });
      },
      src: removeImg,
      label: localizedString.dataSourceRemove
    }
  };
};

export default PanelTitleDefaultElement;
