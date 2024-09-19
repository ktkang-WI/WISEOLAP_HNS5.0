import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import ItemType from 'components/report/item/util/ItemType';
import ScrollSetting from 'components/report/util/ScrollSetting';
import {useEffect, useRef, useState} from 'react';
import {ContextMenu} from 'devextreme-react';
import useContextMenu from 'hooks/useContextMenu';
import {useSelector} from 'react-redux';
import {selectCurrentJobMessageItem,
  selectJobQuantityItem} from 'redux/selector/LoadingSelector';
import {LoadingImg,
  LoadingMsg}
  from 'components/common/atomic/Loading/organisms/LoadingPanel';

const theme = getTheme();

const ItemWrapper = styled(Wrapper)`
  border: 1px solid ${theme.color.breakLine};
  border-top: 1px solid ${theme.color.gray100};
  height: 100%;
  width: 100%;
  overflow: hidden;
  overflow-y: ${(props) => (props.overflowY ? props.overflowY : 'hidden')};
  position: relative;
  &.tab-selected:not(.download)::after {
    content: "";
    position: absolute;
    top: -1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    border: 2px solid var(--primary2);
    pointer-events: none;
    border-radius: 0px 0px 10px 10px;
    border-top: 1px solid ${theme.color.gray100};
  }
`;

const ItemContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px 20px;
`;

const ItemBackground = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  z-index: 2000;
`;

const Loading = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
    width: 100px;
    height: 160px;
    z-index: 99999999999;
`;

const Item = ({children, item, ...props}) => {
  const {className, overflowY} = ScrollSetting.getScrollOptions({
    overflowYItems: [ItemType.COLLAPSIBLE_TREE],
    type: children?.type?.type?.name
  });
  const jobQuantity = useSelector(selectJobQuantityItem);
  const jobMsg = useSelector(selectCurrentJobMessageItem);
  const isPivot = item?.type === 'pivot';
  const isLoading = item.mart?.dataSourceConfig?.isLoading();

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
      className={className + (props.className || '')}
      overflowY={overflowY}
    >
      <ItemContent>
        {isPivot &&
          jobQuantity > 0 && isLoading &&
          <ItemBackground>
            <Loading className="loading-screen">
              <LoadingImg/>
              <LoadingMsg>{jobMsg}</LoadingMsg>
            </Loading>
          </ItemBackground>}
        {children}
      </ItemContent>
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
