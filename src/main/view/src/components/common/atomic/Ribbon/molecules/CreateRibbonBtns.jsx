import AddRibbonBtn from '../atom/AddRibbonBtn';
import AddCommonBtn from '../atom/AddCommonBtn';
import AddOnlyImageBtn from '../atom/AddOnlyImageBtn';
import ribbonDefaultElement from '../organism/RibbonDefaultElement';
import RibbonBtnWrap from '../atom/RibbonBtnWrap';
import Popover from '../../Popover/organism/Popover';
import ItemManager from 'components/report/item/util/ItemManager';
import RibbonPopoverBtn from '../atom/RIbbonPopoverBtn';
import {selectCurrentReportType} from 'redux/selector/ConfigSelector';
import ReportType from 'components/designer/util/ReportType';
import store from 'redux/modules';

const CreateRibbonBtns = ({items, targetItem}) => {
  const eventManager = ItemManager.useCustomEvent();

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
    } else if (item.type === 'PopoverButton') {
      return (<RibbonPopoverBtn item={item}/>);
    }
  };

  const itemIterator = (ribbonDefaultItems, items) => {
    if (!items) return;

    const itemArr = [...items];

    return itemArr.map((item) => {
      if (typeof item === 'string') {
        // 공통 Ribbon 버튼 렌더링 (캡션보기, 이름편집 등)
        if (ribbonDefaultItems[item]) {
          return getRibbonItem({...(ribbonDefaultItems[item])});
        } else if (targetItem) {
          // 아이템별 Ribbon 버튼 렌더링
          try {
            const config =
            eventManager.getRibbonItemConfig(targetItem.type, item);

            return getRibbonItem({...config});
          } catch (e) {
            console.error(e);
            return <></>;
          }
        }
      } else if (item) {
        return getRibbonItem({...item});
      }
    });
  };

  const ribbonDefaultItems = () => {
    const reportType = selectCurrentReportType(store.getState());
    const ribbonDefault = ribbonDefaultElement();
    let returnDefault;
    if (reportType === ReportType.EXCEL) {
      const {Dataset, QuerySearch} = ribbonDefault;
      returnDefault = {Dataset, QuerySearch};
    } else {
      returnDefault = ribbonDefault;
    }
    return returnDefault;
  };
  return (
    <RibbonBtnWrap>
      {itemIterator(ribbonDefaultItems(), items)}
    </RibbonBtnWrap>
  );
};
export default CreateRibbonBtns;
