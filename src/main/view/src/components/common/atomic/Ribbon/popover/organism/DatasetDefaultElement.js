import localizedString from 'config/localization';
import SelectCubeModal from 'components/dataset/modal/SelectCubeModal';
import useModal from 'hooks/useModal';
import QueryDataSourceDesignerModal
  from 'components/dataset/modal/QueryDataSourceDesignerModal';
import SelectDataSourceModal
  from 'components/dataset/modal/SelectDataSourceModal';
import SelectUserUploadTableModal
  from 'components/dataset/modal/SelectUserUploadTableModal';
import UserUploadTableModal
  from 'components/dataset/modal/UserUploadTableModal';
import SelectTableModal from 'components/dataset/modal/SelectTableModal';
import SingleTableDesignerModal
  from 'components/dataset/modal/SingleTableDesignerModal';
import {getTheme} from 'config/theme';
import {useSelector} from 'react-redux';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {DesignerMode} from 'components/config/configType';
import DatasetType from 'components/dataset/utils/DatasetType';


const DatasetDefaultElement = () => {
  const {openModal} = useModal();
  const theme = getTheme();
  const reportType = useSelector(selectCurrentDesignerMode);
  const returnVal = {
    dataset: [
      {
        id: DatasetType.CUBE,
        label: localizedString.addCUBE,
        imgSrc: '',
        visible: true,
        onClick: () => {
          openModal(SelectCubeModal);
        }
      },
      {
        id: DatasetType.DS_SQL,
        label: localizedString.addDsSQL,
        imgSrc: '',
        visible: true,
        onClick: () => {
          openModal(SelectDataSourceModal, {
            onSubmit: (dataSource) => {
              openModal(QueryDataSourceDesignerModal,
                  {selectedDataSource: dataSource}
              );
            }
          });
        }
      },
      {
        id: DatasetType.DS_SINGLE,
        label: localizedString.addDsSingle,
        imgSrc: '',
        visible: true,
        onClick: () => {
          openModal(SelectDataSourceModal, {
            onSubmit: (dataSource) => {
              openModal(SelectTableModal, {
                onSubmit: (selectedTable, columns) => {
                  openModal(SingleTableDesignerModal,
                      {
                        selectedDataSource: dataSource,
                        selectedTable: selectedTable,
                        columns: columns
                      }
                  );
                },
                dsId: dataSource.dsId,
                dsViewId: dataSource.dsViewId,
                height: theme.size.bigModalHeight,
                width: theme.size.bigModalWidth
              });
            },
            isSingleTable: true
          });
        }
      },
      {
        id: DatasetType.DS_UPLOAD,
        label: localizedString.addDsUpload,
        imgSrc: '',
        visible: true,
        onClick: () => {
          openModal(SelectDataSourceModal, {
            onSubmit: (dataSource) => {
              openModal(SelectUserUploadTableModal, {
                onSubmit: (selectedTable) => {
                  openModal(UserUploadTableModal, {
                    onSubmit: (selectedTable, columns) => {
                      openModal(SingleTableDesignerModal,
                          {
                            selectedDataSource: dataSource,
                            selectedTable: selectedTable,
                            columns: columns
                          }
                      );
                    },
                    dsId: dataSource.dsId,
                    selectedTable: selectedTable
                  });
                },
                dsId: dataSource.dsId,
                selectedDataSource: dataSource,
                height: theme.size.bigModalHeight,
                width: theme.size.bigModalWidth
              });
            },
            isSingleTable: false
          });
        }
      }
    ],
    keys: ['dataset']
  };

  if (reportType === DesignerMode['EXCEL']) {
    delete returnVal.dataset[0];
  }
  return returnVal;
};
export default DatasetDefaultElement;
