import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import {SelectBox} from 'devextreme-react';
import {useState} from 'react';

const theme = getTheme();

const notationFormats = [
  {
    key: 'none',
    value: '없음'
  },
  {
    key: 'argument',
    value: '인수'
  },
  {
    key: 'value',
    value: '값'
  },
  {
    key: 'percent',
    value: '%'
  },
  {
    key: 'argument_value',
    value: '인수 및 값'
  },
  {
    key: 'value_percent',
    value: '값 및 %'
  },
  {
    key: 'argument_percent',
    value: '인수 및 %'
  },
  {
    key: 'value_argument_percent',
    value: '인수, 값 및 %'
  }
];

export const getOptionValue = (key) => {
  const options = {
    argument: false,
    value: false,
    percent: false
  };
  const keys = key.split('_');
  if (keys === 'none') return options;
  keys.forEach((item) => {
    options[item] = true;
  });
  return options;
};

const NotationFormatModal = ({popupName, notationFormat, ...props}) => {
  const [value, setValue] =
    useState(notationFormats.filter((item) => item.key === notationFormat)[0]);

  const handleValueChanged = (e) => {
    setValue(e.value);
  };

  return (
    <Modal
      onSubmit={() => {
        props.onSubmit({notationFormat: value});
        return false;
      }}
      onClose={()=>{
        return props.onClose();
      }}
      modalTitle={props.modalTitle}
      width={theme.size.smallModalWidth}
      height='230px'
    >
      <SelectBox
        value={value}
        items={notationFormats}
        displayExpr={'value'}
        onValueChanged={handleValueChanged}
      >
      </SelectBox>
    </Modal>
  );
};

export default NotationFormatModal;
