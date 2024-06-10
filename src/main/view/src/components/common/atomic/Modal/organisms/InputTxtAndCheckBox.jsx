import {CheckBox, TextBox} from 'devextreme-react';
import Modal from './Modal';
import {useState} from 'react';

const InputTxtAndCheckBox = ({
  onSubmit, modalTitle, label, defaultValue='', ...props
}) => {
  const [value, setValue] = useState(defaultValue);
  const [check, setCheck] = useState(false);

  return (
    <Modal
      modalTitle={modalTitle}
      width='400px'
      height='230px'
      onSubmit={() => {
        onSubmit(value, check);
      }}
      {...props}
    >
      <CheckBox
        text= '최상위 폴더 생성'
        value={check}
        onValueChanged={(e) => {
          setCheck(e.value);
        }}
      ></CheckBox>
      <TextBox
        label={label}
        value={value}
        onValueChange={(v) => setValue(v)}
      />
    </Modal>
  );
};

export default InputTxtAndCheckBox;
