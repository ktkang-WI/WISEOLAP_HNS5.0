import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const SmallButtonLabel = styled.div`
  height: 15px;
  width: 100%;
  text-align: center;
  font: ${theme.font.small};
  color: ${theme.color.primaryFont};
  letter-spacing: -1px;
`;

export default SmallButtonLabel;
