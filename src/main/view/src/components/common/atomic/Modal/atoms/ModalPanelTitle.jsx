import {getTheme} from 'config/theme';
import {styled} from 'styled-components';

const theme = getTheme();

const ModalPanelTitle = styled.span`
  width: 100%;
  height: 20px;
  display: block;
  padding-bottom: 5px;
  font: ${theme.font.modalTitle};
  color: ${theme.color.primary};
  border-bottom: solid 1px ${theme.color.breakLine};
`;

export default ModalPanelTitle;
