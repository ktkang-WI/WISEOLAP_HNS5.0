import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const TextButton = styled.div`
  font: ${theme.font.textButton};
  color: ${theme.color.secondary};
  cursor: pointer;
  word-break: keep-all;
  margin: 0px 10px;
  white-space: nowrap;
`;

export default TextButton;
