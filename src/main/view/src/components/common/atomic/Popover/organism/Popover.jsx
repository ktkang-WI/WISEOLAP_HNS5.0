import {ControlledMenu} from '@szhsin/react-menu';
// import usePopover from 'hooks/usePopover';
import React from 'react';
import {useSelector} from 'react-redux';
import {selectOpenedPopover} from 'redux/selector/PopoverSelector';

// react menu 사용. 팝오버 띄우는 용도.
const Popover = () => {
  const selectedPopover = useSelector(selectOpenedPopover);
  // const {closePopover} = usePopover();

  const {Component, props} = selectedPopover;
  const onClose = (e) => {
    // console.log(e);
  };
  return (
    <ControlledMenu
      id='Popover'
      state={selectedPopover.isOpen ? 'open' : 'closed'}
      anchorRef={selectedPopover.targetRef}
      onClose={onClose}
    >
      {Component ? <Component props={{...props}}/> : <div></div>}
    </ControlledMenu>
  );
};
export default React.memo(Popover);
