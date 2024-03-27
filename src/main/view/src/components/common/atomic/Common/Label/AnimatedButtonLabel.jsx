import {styled, css} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const AnimatedButtonLabel = styled.div`
  height: 15px;
  width: 100%;
  text-align: ${(props) => props.textAlign || 'center'};
  font: ${theme.font.snb};
  letter-spacing: -1px;
  position: relative;
  ${(props) => props.textAlign == 'left' && css`
    padding: 5px;
  `}
`;

export default AnimatedButtonLabel;
