import localizedString from 'config/localization';
import SelectCubeModal from 'components/dataset/modal/SelectCubeModal';
import useModal from 'hooks/useModal';
import QueryDataSourceDesignerModal
  from 'components/dataset/modal/QueryDataSourceDesignerModal';
import SelectDataSourceModal
  from 'components/dataset/modal/SelectDataSourceModal';

const DatasetDefaultElement = () => {
  const {openModal} = useModal();
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
      }
      // {
      //   label: localizedString.addDsSingle,
      //   imgSrc: '',
      //   visible: true,
      //   onClick: () => {
      //     console.log('singleTable');
      //   }
      // },
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
