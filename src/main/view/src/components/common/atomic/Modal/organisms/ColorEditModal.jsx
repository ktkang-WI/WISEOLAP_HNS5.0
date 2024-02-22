import {getTheme} from 'config/theme';
import Modal from './Modal';
import {useState} from 'react';
import {
  Field,
  FieldLabel,
  FieldSet,
  FieldValue
} from '../../Common/DevExtreme/Field';
import {ColorBox} from 'devextreme-react';

const defaultModeLabel = {'aria-label': 'Default mode'};

const theme = getTheme();

const getRandomHexColor = () => {
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 16).toString(16);
  }
  return color;
};

const ColorEditModal = ({popupName, ...props}) => {
  if (props?.measures?.length == 0) {
    console.error('state of grid error nothing measures value in state');
  }
  if (props?.colorEdit?.length == 0) {
    console.error('state of grid error nothing colorEdit value in state');
  }
  const measures = props.measures;
  const colorEdit = props.colorEdit;
  const colorEditLen = colorEdit.length;
  const state = [];

  measures.forEach((item, index) => {
    const object = {
      caption: '',
      fieldId: '',
      value: ''
    };
    const isThisInitValue = colorEditLen <= index;
    object.caption = item.caption;
    object.fieldId = item.fieldId;
    if (isThisInitValue) {
      object.value = getRandomHexColor();
    } else {
      const field = colorEdit.filter((i) => i.fieldId === item.fieldId);
      field?.length !== 0 ?
      object.value = field[0].value : object.value = getRandomHexColor();
    }
    state.push(useState(object));
  });

  const handleColorPickerValue = (e, setValue) => {
    setValue((prev) => {
      return {
        ...prev,
        value: e.value
      };
    });
  };

  return (
    <Modal
      onSubmit={() => {
        props.onSubmit({colorEdit: state.map((item) => item[0])});
        return false;
      }}
      onClose={() => {
        return props.onClose();
      }}
      modalTitle={props.modalTitle}
      width={theme.size.smallModalWidth}
      height={theme.size.middleModalHeight}
    >
      <FieldSet>
        {
          state.map((item, index) => {
            const [value, setValue] = item;

            return (
              <Field key={index}>
                <FieldLabel>{value.caption}</FieldLabel>
                <FieldValue
                  defaultValue={value.value}
                  onValueChanged={(e) =>
                    handleColorPickerValue(e, setValue)}
                >
                  <ColorBox
                    onValueChanged={props.onValueChanged}
                    defaultValue={props.defaultValue}
                    inputAttr={defaultModeLabel}
                  />
                </FieldValue>
              </Field>
            );
          }
          )}
      </FieldSet>
    </Modal>
  );
};

export default ColorEditModal;
