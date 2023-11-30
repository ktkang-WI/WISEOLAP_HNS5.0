import localizedString from 'config/localization';
import SelectCubeModal from 'components/dataset/modal/SelectCubeModal';
import useModal from 'hooks/useModal';
import usePopover from 'hooks/usePopover';
import QueryDataSourceDesignerModal
  from 'components/dataset/modal/QueryDataSourceDesignerModal';
import SelectDataSourceModal
  from 'components/dataset/modal/SelectDataSourceModal';

const DatasetDefaultElement = () => {
  const {closePopover} = usePopover();
  const {openModal} = useModal();
  return {
    dataset: [
      {
        label: localizedString.addCUBE,
        imgSrc: '',
        visible: true,
        onClick: () => {
          openModal(SelectCubeModal);

          closePopover();
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

          closePopover();
        }
      },
      {
        label: localizedString.addDsSingle,
        imgSrc: '',
        visible: true,
        onClick: () => {
          console.log('singleTable');
        }
      },
      {
        label: localizedString.addDsUpload,
        imgSrc: '',
        visible: true,
        onClick: () => {
          console.log('upload');
        }
      }
    ],
    keys: ['dataset']
  };
};
export default DatasetDefaultElement;
