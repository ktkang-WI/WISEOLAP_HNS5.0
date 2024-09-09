import customFieldImg from 'assets/image/icon/button/custom_field.png';
import fieldDescriptionImg
  from 'assets/image/icon/button/field_description.png';
import modifyImg from 'assets/image/icon/button/modify.png';
import removeImg from 'assets/image/icon/button/remove.png';
import showHiddenFieldsImg
  from 'assets/image/icon/button/show_visible_field.png';
import showHiddenFieldsDisabledImg
  from 'assets/image/icon/button/show_visible_field_disabled.png';
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
import useQueryExecute from 'hooks/useQueryExecute';
import {useSelector} from 'react-redux';
import {selectCurrentItem, selectRootItem} from 'redux/selector/ItemSelector';
import FieldDescriptionModal
  from 'components/dataset/modal/FieldDescriptionModal';
import viewerPostingImg from 'assets/image/icon/button/preview.png';
import ViewerPostingDataModal
  from 'components/dataset/modal/ViewPostingData/ViewerPostingDataModal';
import {getAppliedDataItem, getOnlyUniNm}
  from 'components/dataset/modal/ViewPostingData/viewPostingUtility';

const PanelTitleDefaultElement = () => {
  const {openModal, alert, confirm} = useModal();
  const {executeParameterDefaultValueQuery} = useQueryExecute();
  const dispatch = useDispatch();
  const {deleteDataset, updateDataset} = DatasetSlice.actions;
  const {deleteParameterByDatasetId,
    updateParameterInformation
  } = ParameterSlice.actions;
  const {initItemByDatasetId} = ItemSlice.actions;
  const selectedCurrentItem = useSelector(selectCurrentItem);
  const selectedDataset = useSelector(selectCurrentDataset);
  const reportId = useSelector(selectCurrentReportId);

  const handleCustomData = async () => {
    const dataset = selectCurrentDataset(store?.getState());
    if (!selectedCurrentItem) {
      alert(localizedString.itemNotSelected);
      return;
    }
    if (!dataset) {
      alert(localizedString.datasetNotSelected);
      return;
    }
    const dataSource = await models?.DataSource?.getByDsId(dataset?.dsId);
    if (!dataSource) {
      alert(localizedString.datasetNotSelected);
      return;
    }
    openModal(UserDefinedDataModal,
        {selectedDataSource: dataSource, orgDataset: dataset});
  };

  const viewerPostingFunc = () => {
    const dataset = selectCurrentDataset(store?.getState());
    const rootItem = selectRootItem(store?.getState());

    if (dataset) {
      const fields = dataset.fields.filter((data) =>
        data.type == 'MEA' || data.type == 'DIM'
      );

      const selectRowKeys = dataset.selectedFields || [];

      const appliedDataItem = getAppliedDataItem(rootItem);
      const onlyUniNm = getOnlyUniNm(appliedDataItem, dataset.datasetId);

      openModal(ViewerPostingDataModal, {
        fields: fields,
        datasetId: dataset.datasetId,
        selectRowKeys: selectRowKeys,
        appliedDataItem: onlyUniNm || []
      });
    } else {
      alert(localizedString.selectDataset);
      return;
    }
  };

  return {
    ViewerPostingData: {
      id: 'viewer_posting_data',
      onClick: viewerPostingFunc,
      src: viewerPostingImg,
      label: localizedString.viewerPosting
    },
    ShowHiddenFields: {
      id: 'show_hidden_fields',
      onClick: () => {
        if (_.isEmpty(selectedDataset)) return;
        dispatch(updateDataset({
          reportId,
          dataset: {
            ...selectedDataset,
            showHiddenFields: !selectedDataset.showHiddenFields
          }
        }));
      },
      src: selectedDataset?.showHiddenFields ?
        showHiddenFieldsImg : showHiddenFieldsDisabledImg,
      label: localizedString.showHiddenFields
    },
    CustomField: {
      id: 'custom_field',
      onClick: handleCustomData,
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
            onSubmit: async (params) => {
              const promises = [];
              params.forEach((param) => {
                if (param.defaultValueUseSql) {
                  promises.push(new Promise(async (resolve) => {
                    try {
                      await executeParameterDefaultValueQuery(param);
                      resolve();
                    } catch (e) {
                      alert(param.caption + localizedString.invalidQuery);
                    }
                  }));
                }
              });
              await Promise.all(promises).then(() => {
                dispatch(updateParameterInformation({
                  datasetId: dataset.datasetId,
                  reportId: reportId,
                  informations: params
                }));
              }).catch((e) => {
                console.log(e);
              });
            }});
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
          dispatch(initItemByDatasetId({reportId, datasetId}));
        });
      },
      src: removeImg,
      label: localizedString.dataSourceRemove
    },
    FieldDescription: {
      id: 'field_description',
      onClick: () => {
        openModal(FieldDescriptionModal);
      },
      src: fieldDescriptionImg,
      label: localizedString.addFieldDescription
    }
  };
};

export default PanelTitleDefaultElement;
