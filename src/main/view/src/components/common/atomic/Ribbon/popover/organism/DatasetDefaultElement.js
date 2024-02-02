import localizedString from 'config/localization';
import SelectCubeModal from 'components/dataset/modal/SelectCubeModal';
import useModal from 'hooks/useModal';
import QueryDataSourceDesignerModal
  from 'components/dataset/modal/QueryDataSourceDesignerModal';
import SelectDataSourceModal
  from 'components/dataset/modal/SelectDataSourceModal';
import SelectTableModal from 'components/dataset/modal/SelectTableModal';
import SingleTableDesignerModal
  from 'components/dataset/modal/SingleTableDesignerModal';
import {getTheme} from 'config/theme';

const DatasetDefaultElement = () => {
  const {openModal} = useModal();
  const theme = getTheme();
  return {
    dataset: [
      {
        label: localizedString.addCUBE,
        imgSrc: '',
        visible: true,
        onClick: () => {
          openModal(SelectCubeModal);
        }
      },
      {
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
      }
      // {
      //   label: localizedString.addDsUpload,
      //   imgSrc: '',
      //   visible: true,
      //   onClick: () => {
      //     console.log('upload');
      //   }
      // }
    ],
    keys: ['dataset']
  };
};
export default DatasetDefaultElement;
