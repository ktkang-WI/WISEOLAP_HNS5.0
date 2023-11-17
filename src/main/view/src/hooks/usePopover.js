import {useDispatch} from 'react-redux';
import PopoverSlice from 'redux/modules/PopoverSlice';

export default function usePopover() {
  const dispatch = useDispatch();
  const popoverSlice = PopoverSlice.actions;

  const openedPopover = (target, content) => {
    dispatch(popoverSlice.openPopover({target: target, content: content}));
  };

  const openedPopover2 = (target) => {
    dispatch(popoverSlice.openPopover2(target));
  };
  return {
    openedPopover,
    openedPopover2
  };
};
