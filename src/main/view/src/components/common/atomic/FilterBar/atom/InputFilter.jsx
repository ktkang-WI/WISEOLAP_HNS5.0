import {TextBox} from 'devextreme-react';
import {getTheme} from 'config/theme';
import {isPortal} from 'components/utils/PortalUtility';

const theme = getTheme();

const InputFilter = ({info, value, isTo, onValueChanged, id, width}) => {
  const filterHeight = isPortal() ? '45px' : theme.size.filterHeight;

  const index = isTo ? 1 : 0;
  return (
    <TextBox
      width={width}
      height={filterHeight}
      value={value? value.value[index] : ''}
      onValueChanged={(e) => {
        onValueChanged(info.name, e.value, index);
      }}
    />
  );
};

export default InputFilter;
