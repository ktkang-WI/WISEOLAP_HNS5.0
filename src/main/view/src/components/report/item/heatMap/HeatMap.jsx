import React, {useMemo, useRef} from 'react';
import ItemManager from 'components/report/item/util/ItemManager';
import D3HeatMap from './D3HeatMap';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import {getBlendColor} from '../util/ColorManager';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';

const HeatMap = ({
  setItemExports,
  id,
  item
}) => {
  const mart = item?.mart;
  const meta = item?.meta;
  if (!mart.init) {
    return <></>;
  }
  const ref = useRef();
  const {height, width} = useSizeObserver(ref);
  const palette = useMemo(() => getBlendColor({
    color: meta?.palette?.colors,
    item: item
  }), [meta?.palette?.colors]);

  useItemExport({
    id,
    ref,
    type: ItemType.HEAT_MAP,
    data: mart?.data?.data,
    setItemExports});

  return (
    <Wrapper
      ref={ref}
    >
      <D3HeatMap
        dataSource={mart.data.data}
        width={width}
        height={height}
        palette={palette}
      />
    </Wrapper>
  );
};

export default React.memo(HeatMap, ItemManager.commonPropsComparator);
