import {TextBox} from 'devextreme-react';
import Modal from './Modal';
import {useState} from 'react';

const SimpleInputModal = ({
  onSubmit, modalTitle, label, defaultValue='', ...props
}) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <Modal
      modalTitle={modalTitle}
      width='400px'
      height='230px'
      onSubmit={() => {
        return onSubmit(value);
      }}
      {...props}
    >
      <TextBox
        label={label}
        value={value}
        onValueChange={(v) => setValue(v)}
      />
    </Modal>
  );
};

export default SimpleInputModal;
