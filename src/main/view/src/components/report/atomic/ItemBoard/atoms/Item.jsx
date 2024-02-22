import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const ItemWrapper = styled(Wrapper)`
  border: 1px solid ${theme.color.breakLine};
  border-top: 1px solid ${theme.color.gray100};
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const ItemContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px 20px;
`;

// TODO: 추후 아이템별로 나눠야함.
const Item = ({children}) => {
  return (
    <ItemWrapper>
      <ItemContent>
        {children}
      </ItemContent>
    </ItemWrapper>
  );
};

export default Item;
