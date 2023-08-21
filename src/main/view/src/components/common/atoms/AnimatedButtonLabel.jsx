import {styled} from 'styled-components';

import {getTheme} from 'config/theme';

const theme = getTheme();

const AnimatedButtonLabel = styled.div`
  height: 15px;
  width: 100%;
  text-align: center;
  font: ${theme.font.snb};
  letter-spacing: -1px;
  position: relative;
  top: -3px;
`;

export default AnimatedButtonLabel;
