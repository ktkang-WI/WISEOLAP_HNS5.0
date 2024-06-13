import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import ItemType from 'components/report/item/util/ItemType';
import ScrollSetting from 'components/report/util/ScrollSetting';
import {useEffect, useRef} from 'react';
import {ContextMenu} from 'devextreme-react';
import useContextMenu from 'hooks/useContextMenu';
import {selectLinkedReport} from 'redux/selector/LinkSelector';
import {useSelector} from 'react-redux';

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

// TODO: 추후 아이템별로 나눠야함.
const Item = ({children, item, ...props}) => {
  const {className, overflowY} = ScrollSetting.getScrollOptions({
    overflowYItems: [ItemType.COLLAPSIBLE_TREE],
    type: children?.type?.type?.name
  });

  const targetRef = useRef();
  const contextMenuRef = useRef();
  const linkedReport = useSelector(selectLinkedReport);
  const {getContextMenuItems} = useContextMenu(item);

  // context menu 등록
  useEffect(() => {
    if (
      !item ||
      item.type == ItemType.PIVOT_GRID ||
      item.type == ItemType.DATA_GRID
    ) return;
    const handleContextMenu = (e) => {
      e.preventDefault();
      if (contextMenuRef.current) {
        contextMenuRef.current.instance.option('items',
            getContextMenuItems());
        contextMenuRef.current.instance.show(e.clientX, e.clientY);
      }
    };

    const targetElement = targetRef.current;

    if (targetElement) {
      targetElement.addEventListener('contextmenu', handleContextMenu);
    }

    // Clean up the event listener on component unmount
    return () => {
      if (targetElement) {
        targetElement.removeEventListener('contextmenu', handleContextMenu);
      }
    };
  }, [item, linkedReport]);

  return (
    <ItemWrapper ref={targetRef} className={className} overflowY={overflowY}>
      <ContextMenu
        onItemClick={(e) => {
          e.itemData?.onItemClick();
        }}
        ref={contextMenuRef}
      />
      <ItemContent>{children}</ItemContent>
    </ItemWrapper>
  );
};

export default Item;
