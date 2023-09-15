import ItemButtons from '../molecules/ItemButtons';
import ItemTitleText from '../atoms/ItemTitleText';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  height: ${theme.size.itemHeaderHeight};
  border-bottom: 1px solid ${theme.color.breakLine};
  align-items: center;
  justify-content: space-between;
`;

const ItemHeader = ({title}) => {
  return (
    <HeaderWrapper>
      <ItemTitleText>{title}</ItemTitleText>
      <ItemButtons></ItemButtons>
    </HeaderWrapper>
  );
};

export default ItemHeader;
