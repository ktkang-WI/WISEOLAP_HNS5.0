import customFieldImg from 'assets/image/icon/button/custom_field.png';
import modifyImg from 'assets/image/icon/button/modify.png';
import removeImg from 'assets/image/icon/button/remove.png';
import localizedString from 'config/localization';

const PanelTitleDefaultElement = () => {
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
