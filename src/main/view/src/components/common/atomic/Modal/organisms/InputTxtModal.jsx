import {getTheme} from 'config/theme';
import Modal from './Modal';
import {TextBox} from 'devextreme-react';
import {useState} from 'react';
import localizedString from 'config/localization';

const theme = getTheme();
const nameLabel = {'aria-label': 'Name'};

const InputTxtModal = ({...props}) => {
  const [memo, setMemo] = useState(props.memo);

  const handleValueChange = (e) => {
    setMemo(e.value);
  };
  return (
    <Modal
      onSubmit={() => {
        props.onSubmit({memo: memo});
        return false;
      }}
      onClose={() => {
        return props.onClose();
      }}
      modalTitle={props.modalTitle}
      width={theme.size.smallModalWidth}
      height={theme.size.tinyModalHeight}
    >
      <TextBox
        defaultValue={memo}
        placeholder={localizedString.colorEditPlaceHolder}
        inputAttr={nameLabel}
        onValueChanged={handleValueChange}
      />
    </Modal>
  );
};

export default InputTxtModal;
