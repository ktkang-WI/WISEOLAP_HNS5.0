import {getTheme} from 'config/theme';
import {styled} from 'styled-components';

const theme = getTheme();

const PanelTitleText = styled.span`
  color: ${(props) => props.color || theme.color.gray600};
  font: ${theme.font.panelTitle};
  ${(props) => props.fontWeight ?
    'font-weight: ' + props.fontWeight + ';' : ''}
`;


export default PanelTitleText;
