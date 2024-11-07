import DefaultCard from 'components/common/atomic/Common/Card/DefaultCard';
import React, {useRef} from 'react';
import {useInteractiveEffect} from '../util/useInteractiveEffect';
import ItemType from '../util/ItemType';
import useItemExport from 'hooks/useItemExport';


const Card = ({setItemExports, id, item, node}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart.init) {
    return <></>;
  }
  const dataSource = mart.data.data;
  const seriesNames = mart.data.info.seriesMeasureNames;

  const dxRef = useRef();
  const {
    functions
  } = useInteractiveEffect({
    item: item,
    meta: meta,
    selectionFunc: (event) => {
      const refs = event.map((item) => item.ref);
      if (refs.length === 0) return;
      refs.forEach((ref) => {
        ref.current.style.backgroundColor = '#f1f1f1';
      });
    },
    removeSelectionFunc: (event) => {
      const refs = event.map((item) => item.ref);
      refs.forEach((ref) => {
        if (!ref?.current) return;
        ref.current.style.backgroundColor = '';
      });
    }
  });

  useItemExport({
    id,
    ref: dxRef,
    type: ItemType.CARD,
    data: mart?.data?.data,
    setItemExports});

  const handleClick = (e, data) => {
    e.data = data.title;
    functions.setDataMasterFilter(e.data);
    functions.masterFilterReload(e);
  };
  return (
    <DefaultCard
      ref={dxRef}
      width={node?._rect?.width}
      dataSource={dataSource}
      argumentField='arg'
      autoCoulmn={meta?.cardOption?.contentArray.autoNumberSet}
      columnNumber={meta?.cardOption?.contentArray.columnNumber}
      valueFiled={seriesNames[0].summaryName}
      onClick={handleClick}
      column={2}
    />
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
