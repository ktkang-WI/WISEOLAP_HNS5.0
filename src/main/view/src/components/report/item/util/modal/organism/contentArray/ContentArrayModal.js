import {
  FieldSet,
  Field,
  FieldLabel,
  FieldValue
} from 'components/common/atomic/Common/DevExtreme/Field';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import {CheckBox, NumberBox} from 'devextreme-react';
import {useState} from 'react';
import localizedString from 'config/localization';

const theme = getTheme();

const ContentArrayModal = ({
  popupName,
  contentArray,
  max = 10,
  ...props}) => {
  const [autoNumberSet, setAutoNumberSet] =
    useState(contentArray.autoNumberSet);
  const [columnNumber, setColumnNumber] =
    useState(contentArray.columnNumber);

  const handleCheckBox = (e) => {
    setAutoNumberSet(e.value);
  };

  const handleNumberBox = (e) => {
    setColumnNumber(e.value);
  };

  return (
    <Modal
      onSubmit={() => {
        props.onSubmit({contentArray: {
          autoNumberSet: autoNumberSet,
          columnNumber: columnNumber
        }});
        return false;
      }}
      onClose={()=>{
        return props.onClose();
      }}
      modalTitle={props.modalTitle}
      width={theme.size.smallModalWidth}
      height='335px'
    >
      <FieldSet>
        <Field>
          <FieldLabel>{localizedString.columnNumberAutoSetting}</FieldLabel>
          <FieldValue
          >
            <CheckBox
              defaultValue={autoNumberSet}
              onValueChanged={handleCheckBox}
            />
          </FieldValue>
        </Field>
        <Field>
          <FieldLabel>{localizedString.columnNumber}</FieldLabel>
          <FieldValue
          >
            <NumberBox
              disabled={autoNumberSet}
              defaultValue={columnNumber}
              min={1}
              max={max}
              showSpinButtons={true}
              onValueChanged={handleNumberBox}
            />
          </FieldValue>
        </Field>
      </FieldSet>
    </Modal>
  );
};

export default ContentArrayModal;
