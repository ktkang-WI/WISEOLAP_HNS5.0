// import Popover from '../../Popover/organism/Popover';
import RibbonRibbonBtn from '../atom/RibbonRibbonBtn';
import RibbonCommonBtn from '../atom/RibbonCommonBtn';
import RibbonOnlyImageBtn from '../atom/RibbonOnlyImageBtn';
import ribbonDefaultElement from '../organism/RibbonDefaultElement';
import RibbonBtnWrap from '../atom/RibbonBtnWrap';

const CreateRibbonBtns = ({items, loaction}) => {
  const getRibbonItem = (item) => {
    if (item.type === 'RibbonButton') {
      return (<RibbonRibbonBtn item={item}/>);
    } else if (item.type === 'OnlyImageButton') {
      return (<RibbonOnlyImageBtn item={item}/>);
    } else if (item.type === 'CommonButton') {
      return (<RibbonCommonBtn item={item}/>);
    }
  };
  const itemIterator = (ribbonDefaultItems, items, loaction) => {
    if (!items) return;

    const itemArr = [...items];

    return itemArr.map((item) => {
      if (typeof item === 'string') {
        return getRibbonItem(
            {...ribbonDefaultItems[item], loaction}
        );
      } else if (item) {
        return getRibbonItem({...item, loaction});
      }
    });
  };

  const ribbonDefaultItems = ribbonDefaultElement();
  return (
    <RibbonBtnWrap>
      {itemIterator(ribbonDefaultItems, items, loaction)}
    </RibbonBtnWrap>
  );
};
export default CreateRibbonBtns;
