import {useDispatch} from 'react-redux';
import PopoverSlice from 'redux/modules/PopoverSlice';

export default function usePopover() {
  const dispatch = useDispatch();
  const popoverSlice = PopoverSlice.actions;

  const openedPopover = (targetRef, component, props) => {
    const param = {
      targetRef: targetRef,
      component: component,
      props: props
    };

    dispatch(popoverSlice.openPopover(param));
  };

  const closePopover = () => {
    dispatch(popoverSlice.closePopover());
  };
  return {
    openedPopover,
    closePopover
  };
};
