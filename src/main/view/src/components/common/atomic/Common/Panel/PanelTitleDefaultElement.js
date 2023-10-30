import customFieldImg from 'assets/image/icon/button/custom_field.png';
import modifyImg from 'assets/image/icon/button/modify.png';
import removeImg from 'assets/image/icon/button/remove.png';
import QueryDataSourceDesignerModal
  from 'components/dataset/modal/QueryDataSourceDesignerModal';
import SelectDataSourceModal
  from 'components/dataset/modal/SelectDataSourceModal';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';

const PanelTitleDefaultElement = () => {
  const {openModal} = useModal();
  return {
    CustomField: {
      id: 'custom_field',
      onClick: () => {
        console.log('눌렸어요!');
      },
      src: customFieldImg,
      label: localizedString.addCustomField,
      imgWidth: '14px'
    },
    DataSourceModify: {
      id: 'data_source_modify',
      onClick: () => {
        openModal(SelectDataSourceModal, {
          onSubmit: (dataSource) => {
            openModal(QueryDataSourceDesignerModal,
                {selectedDataSource: dataSource}
            );
          }
        });
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
