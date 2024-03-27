import {getTheme} from 'config/theme';
import Modal from './Modal';
import {
  Field
} from '../../Common/DevExtreme/Field';
import {ColorBox} from 'devextreme-react';

const defaultModeLabel = {'aria-label': 'Default mode'};

const theme = getTheme();

const ColorEditModal = ({popupName, palette, colorEdit, ...props}) => {
  if (colorEdit?.length == 0) {
    console.error('nothing colorEdit value in state');
  }

  const colorEditLen = colorEdit.length;
  const state = [];

  if (colorEditLen == 0) {
    state.push(...palette.colors.slice(0, 6));
  } else {
    state.push(...colorEdit);
  }

  const handleColorPickerValue = ({value}, idx) => {
    state[idx] = value;
  };

  const getColorBox = () => {
    const elements = [];

    for (let i = 0; i < 6; i++) {
      const element = (
        <Field>
          <ColorBox
            onValueChanged={(e) => handleColorPickerValue(e, i)}
            defaultValue={state[i]}
            inputAttr={defaultModeLabel}
          />
        </Field>
      );

      elements.push(element);
    }

    return elements;
  };

  return (
    <Modal
      onSubmit={() => {
        props.onSubmit({colorEdit: state.filter((color) => color)});
        return false;
      }}
      onClose={() => {
        return props.onClose();
      }}
      modalTitle={props.modalTitle}
      width={theme.size.smallModalWidth}
      height={theme.size.middleModalHeight}
    >
      {getColorBox()}
    </Modal>
  );
};

export default ColorEditModal;
