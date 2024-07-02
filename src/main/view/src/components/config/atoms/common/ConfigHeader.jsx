import {getTheme} from 'config/theme';
import {styled} from 'styled-components';

const theme = getTheme();

const ConfigHeader = styled.div`
  width: calc(100%);
  border-radius: 10px;
  height: 60px;
  border: solid 1px ${theme.color.breakLine};
  background: ${theme.color.panelColor};
  box-sizing: border-box;
  padding: 12px;
`;

export default ConfigHeader;
