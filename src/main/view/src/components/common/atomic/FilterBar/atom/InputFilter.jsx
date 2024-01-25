import {TextBox} from 'devextreme-react';
import {getTheme} from 'config/theme';

const theme = getTheme();

const InputFilter = ({info, value, isTo, onValueChanged, id, width}) => {
  const index = isTo ? 1 : 0;
  return (
    <TextBox
      width={width}
      focusStateEnabled={false}
      hoverStateEnabled={false}
      height={theme.size.filterHeight}
      value={value? value.value[index] : ''}
      onValueChanged={(e) => {
        onValueChanged(info.name, e.value, index);
      }}
    />
  );
};

export default InputFilter;
