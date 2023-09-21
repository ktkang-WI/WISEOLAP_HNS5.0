import {getTheme} from 'config/theme';
import {styled} from 'styled-components';

const theme = getTheme();

const PanelTitleText = styled.span`
  color: ${(props) => props.color || theme.color.secondary};
  font: ${theme.font.panelTitle};
`;


export default PanelTitleText;
