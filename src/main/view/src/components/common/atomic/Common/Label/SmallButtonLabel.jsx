import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const SmallButtonLabel = styled.div`
  height: auto;
  width: 100%;
  text-align: center;
  font: ${theme.font.small};
  letter-spacing: -1px;
`;

export default SmallButtonLabel;
