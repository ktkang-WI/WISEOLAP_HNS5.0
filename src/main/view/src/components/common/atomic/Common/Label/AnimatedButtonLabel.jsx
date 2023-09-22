import {styled, css} from 'styled-components';
import {getConfig} from 'config/config';
import {getTheme} from 'config/theme';

const theme = getTheme();
const useSNBDrawer = getConfig('useSNBDrawer');

const AnimatedButtonLabel = styled.div`
  height: 15px;
  width: 100%;
  text-align: ${(props) => props.textAlign || 'center'};
  font: ${theme.font.snb};
  letter-spacing: -1px;
  position: relative;
  top: ${!useSNBDrawer && '-3px'};
  ${(props) => props.textAlign == 'left' && css`
    padding: 5px;
  `}
`;

export default AnimatedButtonLabel;
