import {getTheme} from 'config/theme';
import Modal from './Modal';
import {ColorBox} from 'devextreme-react';
import {useState} from 'react';

const theme = getTheme();
const defaultModeLabel = {'aria-label': 'Default mode'};

const FieldSet = ({children}) => {
  return (
    <div className="dx-fieldset">
      {children}
    </div>
  );
};

const Field = ({children}) => {
  return (
    <div className="dx-field">
      {children}
    </div>
  );
};

const FieldLabel = ({children}) => {
  return (
    <div className="dx-field-label">
      {children}
    </div>
  );
};

const FieldValue = ({...props}) => {
  return (
    <div className="dx-field-value">
      <ColorBox
        onValueChanged={props.onValueChanged}
        defaultValue={props.defaultValue}
        inputAttr={defaultModeLabel}
      />
    </div>
  );
};


const getRandomHexColor = () => {
  // Generate a random hexadecimal color code
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 16).toString(16);
  }
  return color;
};

const ColorEditModal = ({popupName, ...props}) => {
  // TODO: 예외처리
  if (props?.measures?.length == 0) return;
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
      field.length === 0 ?
        object.value = getRandomHexColor() : object.value = field[0].value;
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
      onClose={()=>{
        return props.onClose();
      }}
      modalTitle={props.modalTitle}
      width={theme.size.smallModalWidth}
      height='600px'
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
                />
              </Field>
            );
          }
          )}
      </FieldSet>
    </Modal>
  );
};

export default ColorEditModal;
