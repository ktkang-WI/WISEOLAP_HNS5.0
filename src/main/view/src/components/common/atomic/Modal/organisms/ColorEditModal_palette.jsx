import {getTheme} from 'config/theme';
import Modal from './Modal';
import {
  Field
} from '../../Common/DevExtreme/Field';
import {ColorBox, NumberBox} from 'devextreme-react';
import {useEffect, useState} from 'react';

const defaultModeLabel = {'aria-label': 'Default mode'};

const theme = getTheme();

const ColorEditModal = ({popupName, palette, colorEdit, ...props}) => {
  const [colorLen, setColorLen] = useState(
      colorEdit?.length || palette?.colors?.length || 6);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    console.log(colors);
    if (colors.length == 0) {
      const newColors = [];
      if (!colorEdit?.length) {
        newColors.push(...palette.colors);
      } else {
        newColors.push(...colorEdit);
      }

      setColors(newColors);
    }
  }, []);

  useEffect(() => {
    if (colors.length > 0) {
      setColors(colors.slice(0, colorLen));
    }
  }, [colorLen]);


  const handleColorPickerValue = ({value}, idx) => {
    const newColors = [...colors];
    newColors[idx] = value;
    setColors(newColors);
  };

  const getColorBox = () => {
    const elements = [];

    for (let i = 0; i < colorLen; i++) {
      const element = (
        <Field>
          <ColorBox
            onValueChanged={(e) => handleColorPickerValue(e, i)}
            value={colors.length > i ? colors[i] : ''}
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
        props.onSubmit({colorEdit: colors.filter((color) => color)});
        return false;
      }}
      onClose={() => {
        return props.onClose();
      }}
      modalTitle={props.modalTitle}
      width={theme.size.smallModalWidth}
      height={theme.size.middleModalHeight}
    >
      <p>색상 개수</p>
      <NumberBox
        value={colorLen}
        onValueChanged={({value}) => setColorLen(value)}>
      </NumberBox>
      <br/>
      {getColorBox()}
    </Modal>
  );
};

export default ColorEditModal;
