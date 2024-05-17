import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const FilterLabel = styled.span`
  color: ${(props) => props.color || theme.color.primaryFont};
  width: ${(props) => props.width || 'auto'};
  margin-right: 7px;
  font: ${theme.font.filterLabel};
  letter-spacing: -1px;
  white-space: nowrap;
`;

export default FilterLabel;
