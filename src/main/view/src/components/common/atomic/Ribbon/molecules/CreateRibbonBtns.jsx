import AddRibbonBtn from '../atom/AddRibbonBtn';
import AddCommonBtn from '../atom/AddCommonBtn';
import AddOnlyImageBtn from '../atom/AddOnlyImageBtn';
import ribbonDefaultElement from '../organism/RibbonDefaultElement';
import RibbonBtnWrap from '../atom/RibbonBtnWrap';
import Popover from '../../Popover/organism/Popover';

const CreateRibbonBtns = ({items}) => {
  const getRibbonItem = (item) => {
    if (item.type === 'RibbonButton' && !item.usePopover) {
      return (<AddRibbonBtn item={item}/>);
    } else if (item.usePopover == true) {
      return (
        <Popover btn={<AddRibbonBtn item={item}/>}/>
      );
    } else if (item.type === 'OnlyImageButton') {
      return (<AddOnlyImageBtn item={item}/>);
    } else if (item.type === 'CommonButton') {
      return (<AddCommonBtn item={item}/>);
    }
  };
  const itemIterator = (ribbonDefaultItems, items) => {
    if (!items) return;

    const itemArr = [...items];

    return itemArr.map((item) => {
      if (typeof item === 'string') {
        return getRibbonItem(
            {...ribbonDefaultItems[item]}
        );
      } else if (item) {
        return getRibbonItem({...item});
      }
    });
  };

  const ribbonDefaultItems = ribbonDefaultElement();
  return (
    <RibbonBtnWrap>
      {itemIterator(ribbonDefaultItems, items)}
    </RibbonBtnWrap>
  );
};
export default CreateRibbonBtns;
