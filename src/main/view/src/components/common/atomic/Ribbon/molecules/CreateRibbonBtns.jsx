import Popover2 from '../../Popover/organism/Popover2';
import RibbonBtn from '../atom/RibbonButton';
import RibbonCommonBtn from '../atom/RibbonCommonBtn';
import RibbonOnlyImageBtn from '../atom/RibbonOnlyImageBtn';
import ribbonDefaultElement from './RibbonDefaultElement';

const CreateRibbonBtns = ({items, loaction}) => {
  const onClick = (self) => {
    console.log('test');
    console.log(self);
  };

  const getRibbonItem = (item) => {
    if (item.type === 'RibbonButton' && item.useArrowButton == false) {
      return (
        <RibbonBtn item={item}/>
      );
    } else if (item.type === 'RibbonButton' &&
      (item.useArrowButton == true || item.id === 'connect_report')) {
      return (
        <div>
          <RibbonBtn onClick={onClick(self)} item={item}/>
          <Popover2
            id={item.id}
          />
        </div>
      );
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
    itemIterator(ribbonDefaultItems, items, loaction)
  );
};
export default CreateRibbonBtns;
