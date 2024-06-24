import {useState} from 'react';
import Modal from '../../Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import TopBottomForm from './TopBottom/TopBottomForm';

const theme = getTheme();

const TopBottomModal = ({data, onSubmit, ...props}) => {
  const [formData, setFormData] = useState(_.cloneDeep(data.topBottom || {}));

  const onDelete = () => {
    onSubmit(null);
  };

  return (
    <Modal
      modalTitle={localizedString.topBottom}
      height={theme.size.middleModalHeight}
      width={theme.size.middleModalHeight}
      onSubmit={() => onSubmit({...formData, applyField: data.name})}
      buttons={[{
        text: localizedString.deleteReport,
        onClick: () => onDelete()
      }]}
      {...props}
    >
      <TopBottomForm
        formData={formData}
        onFieldDataChanged={(e) => {
          setFormData({[e.dataField]: e.value});
        }}
      />
    </Modal>
  );
};

export default TopBottomModal;
