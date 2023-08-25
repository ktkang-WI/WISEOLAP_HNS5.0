import {TextBox} from 'devextreme-react';
import {getTheme} from 'config/theme';

const theme = getTheme();

const InputFilter = (props) => {
  return (
    <TextBox
      focusStateEnabled={false}
      hoverStateEnabled={false}
      height={theme.size.filterHeight}
      {...props}
    />
  );
};

export default InputFilter;
