import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import {useMemo, useRef} from 'react';
import D3WaterFall from './D3WaterFall';
import {getBlendColor} from '../util/ColorManager';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';

const WaterFall = ({
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
  const seriesNames = mart.data.info.seriesMeasureNames;

  const {height, width} = useSizeObserver(ref);
  const palette = useMemo(() => getBlendColor({
    color: meta?.palette?.colors,
    item: item
  }), [meta?.palette?.colors]);

  useItemExport({
    id,
    ref,
    type: ItemType.WATER_FALL,
    data: mart?.data?.data,
    setItemExports});

  return (
    <Wrapper
      ref={ref}
    >
      <D3WaterFall
        width={width}
        height={height}
        palette={palette}
        dataSource={mart.data.data}
        valueField={seriesNames[0].summaryName}
        labelField='arg'
      />
    </Wrapper>
  );
};

export default WaterFall;
