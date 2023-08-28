import {styled} from 'styled-components';
import {getConfig} from 'config/config';
import {getTheme} from 'config/theme';

const theme = getTheme();
const ribbonOnlyIcon = getConfig('ribbonOnlyIcon');

const RibbonButtonLabel = styled.div`
  height: 15px;
  width: auto;
  text-align: center;
  font: ${theme.font.small};
  color: ${theme.color.primaryFont};
  letter-spacing: -1px;
  display: ${ribbonOnlyIcon? 'none':'block'};
`;

export default RibbonButtonLabel;
