import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import ItemType from 'components/report/item/util/ItemType';
import ScrollSetting from 'components/report/util/ScrollSetting';

const theme = getTheme();

const ItemWrapper = styled(Wrapper)`
  border: 1px solid ${theme.color.breakLine};
  border-top: 1px solid ${theme.color.gray100};
  height: 100%;
  width: 100%;
  overflow: hidden;
  overflow-y: ${(props) => props.overflowY ? props.overflowY : 'hidden'};
`;

const ItemContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px 20px;
`;

// TODO: 추후 아이템별로 나눠야함.
const Item = ({children, ...props}) => {
  const {className, overflowY} = ScrollSetting.getScrollOptions({
    overflowYItems: [ItemType.COLLAPSIBLE_TREE],
    type: children?.type?.type?.name
  });
  return (
    <ItemWrapper
      className={className}
      overflowY={overflowY}
    >
      <ItemContent>
        {children}
      </ItemContent>
    </ItemWrapper>
  );
};

export default Item;
