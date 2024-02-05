import {Menu, MenuButton} from '@szhsin/react-menu';
import usePopover from 'hooks/usePopover';
import {useRef} from 'react';
import {useSelector} from 'react-redux';
import {selectOpenedPopover} from 'redux/selector/PopoverSelector';

// react menu 사용. 팝오버 띄우는 용도.
const Popover = ({btn}) => {
  const ref = useRef();
  const {closePopover} = usePopover();
  const selectedPopover = useSelector(selectOpenedPopover);

  const {Component, props} = selectedPopover;

  const component = () => {
    if (!Component) return <></>;

    return (
      <Component
        id={props.id}
        width={props.width}
        height={props.height}
        popoverType={props.popoverType}
        titlePanel={props.titlePanel}
        {...props}
      />
    );
  };

  const onMenuChange = (e) => {
    // 팝업 닫힐 시 state 초기화.
    if (!e.open) {
      closePopover();
    }
  };

  return (
    <Menu
      id='popover'
      ref={ref}
      onMenuChange={onMenuChange}
      menuButton={
        <MenuButton
          style={{ // 버튼 스타일 제거.
            border: 0,
            backgroundColor: 'transparent',
            padding: 0
          }}
        >
          {btn}
        </MenuButton>}
      position='initial'
      gap={-14} // 버튼과 팝오버 사이에 간격 조절
    >
      {component()}
    </Menu>
  );
};
export default Popover;
