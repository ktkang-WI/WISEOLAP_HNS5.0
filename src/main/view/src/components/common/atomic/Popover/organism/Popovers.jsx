import {useSelector} from 'react-redux';
import {selectOpenedPopover} from 'redux/selector/PopoverSelector';

const Popovers = () => {
  const selectedPopover = useSelector(selectOpenedPopover);
  const Component = selectedPopover.Component;
  const props = selectedPopover.props;
  return (<Component {...props}></Component>);
};
export default Popovers;
