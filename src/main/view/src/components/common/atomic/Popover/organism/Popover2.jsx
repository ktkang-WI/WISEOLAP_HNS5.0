import {ControlledMenu, MenuItem} from '@szhsin/react-menu';
// import {useState} from 'react';
// import {useSelector} from 'react-redux';
// import {selectOpenedPopover} from 'redux/selector/PopoverSelector';

// react menu 사용.
const Popover2 = () => {
  // const selectedPopover = useSelector(selectOpenedPopover);
  return (
    <ControlledMenu
      state={'open'}
    >
      <MenuItem>test1</MenuItem>
      <MenuItem>test2</MenuItem>
      <MenuItem>test3</MenuItem>
    </ControlledMenu>
  );
};
export default Popover2;
