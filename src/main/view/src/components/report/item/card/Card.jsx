import DefaultCard from 'components/common/atomic/Common/Card/DefaultCard';
import React, {useRef} from 'react';
import ItemType from '../util/ItemType';
import useItemExport from 'hooks/useItemExport';
import useSizeObserver from '../util/hook/useSizeObserver';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useItemSetting from '../util/hook/useItemSetting';


const Card = ({setItemExports, id, item, node}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart.init) {
    return <></>;
  }
  const dataSource = mart.data.data;
  const seriesNames = mart.data.info.seriesMeasureNames;
  const {itemTools, filterTools} = useItemSetting(item);

  const dataField = itemTools.getDataField();
  const {setMasterFilterData, getSelectedItem} = filterTools;

  const dxRef = useRef();
  const {width} = useSizeObserver(dxRef);

  useItemExport({
    id,
    ref: dxRef,
    type: ItemType.CARD,
    data: mart?.data?.data,
    setItemExports});

  const handleClick = (e, data) => {
    e.data = data.title;
    setMasterFilterData(e.data);
  };

  return (
    <Wrapper ref={dxRef}>
      <DefaultCard
        ref={dxRef}
        width={width}
        selectedItem={getSelectedItem(true)}
        dataSource={dataSource}
        argumentField='arg'
        height={meta?.cardOption?.contentArray.height}
        autoCoulmn={meta?.cardOption?.contentArray.autoNumberSet}
        columnNumber={meta?.cardOption?.contentArray.columnNumber}
        valueField={seriesNames[0].summaryName}
        targetFields={seriesNames.slice(1)}
        formats={dataField.measure.map(({format}) => format)}
        onClick={handleClick}
        column={2}
      />
    </Wrapper>
  );
};
const propsComparator = (prev, next) => {
  let result = true;
  if (!_.isEqual(prev.item.mart, next.item.mart)) {
    result = false;
  }
  if (!_.isEqual(prev?.node?._rect?.width, next?.node?._rect?.width)) {
    result = false;
  }
  if (!_.isEqual(prev?.item?.meta, next?.item?.meta)) {
    result = false;
  }
  return result;
};

export default React.memo(Card, propsComparator);
