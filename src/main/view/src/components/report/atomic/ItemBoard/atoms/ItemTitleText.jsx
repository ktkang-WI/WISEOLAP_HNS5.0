import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const ItemTitleText = styled.span`
  padding-left: 10px;
  font: ${theme.font.itemTitle};
`;

export default ItemTitleText;
