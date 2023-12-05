import {Menu, MenuButton} from '@szhsin/react-menu';
import {useSelector} from 'react-redux';
import {selectOpenedPopover} from 'redux/selector/PopoverSelector';

// react menu 사용. 팝오버 띄우는 용도.
const Popover = ({btn}) => {
  const selectedPopover = useSelector(selectOpenedPopover);

  const {Component, props} = selectedPopover;

  return (
    <Menu
      id='popover'
      menuButton={
        <MenuButton
          style={{ // 버튼 CSS 제거.
            border: 0,
            backgroundColor: 'transparent',
            padding: 0
          }}
        >
          {btn}
        </MenuButton>}
      position='initial'
    >
      {Component ?
        <Component
          id={props.id}
          width={props.width}
          height={props.height}
          popoverType={props.popoverType}
          titlePanel={props.titlePanel}
          props={{...props}}
        /> : <div></div>}
    </Menu>
  );
};
export default Popover;
