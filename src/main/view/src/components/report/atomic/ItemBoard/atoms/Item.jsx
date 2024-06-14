import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import ItemType from 'components/report/item/util/ItemType';
import ScrollSetting from 'components/report/util/ScrollSetting';
import {useEffect, useRef, useState} from 'react';
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

  const targetRef = useRef();
  const contextMenuRef = useRef();
  const {getContextMenuItems} = useContextMenu(item);
  const [target, setTarget] = useState(false);

  useEffect(() => {
    setTarget(targetRef.current);
  }, []);

  return (
    <ItemWrapper
      ref={targetRef}
      className={className}
      overflowY={overflowY}>
      <ItemContent>{children}</ItemContent>
      {
        target && <ContextMenu
          items={getContextMenuItems()}
          onItemClick={(e) => {
            e.itemData?.onItemClick();
          }}
          target={target}
          ref={contextMenuRef}
        />
      }
    </ItemWrapper>
  );
};
export default Item;
