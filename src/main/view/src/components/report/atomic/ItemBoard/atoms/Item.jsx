import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import ItemType from 'components/report/item/util/ItemType';
import ScrollSetting from 'components/report/util/ScrollSetting';
import {useRef} from 'react';
import {ContextMenu} from 'devextreme-react';
import useContextMenu from 'hooks/useContextMenu';

const theme = getTheme();

const ItemWrapper = styled(Wrapper)`
  border: 1px solid ${theme.color.breakLine};
  border-top: 1px solid ${theme.color.gray100};
  height: 100%;
  width: 100%;
  overflow: hidden;
  overflow-y: ${(props) => (props.overflowY ? props.overflowY : 'hidden')};
`;

const ItemContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px 20px;
`;

const Item = ({children, item, ...props}) => {
  const {className, overflowY} = ScrollSetting.getScrollOptions({
    overflowYItems: [ItemType.COLLAPSIBLE_TREE],
    type: children?.type?.type?.name
  });

  const contextMenuRef = useRef();
  const {getContextMenuItems} = useContextMenu(item);

  return (
    <ItemWrapper
      id={item.id + '_wrapper'}
      className={className}
      overflowY={overflowY}>
      <ItemContent>{children}</ItemContent>
      <ContextMenu
        items={getContextMenuItems()}
        onItemClick={(e) => {
          e.itemData?.onItemClick();
        }}
        target={'#' + item.id + '_wrapper'}
        ref={contextMenuRef}
      />
    </ItemWrapper>
  );
};

export default Item;
