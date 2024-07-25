import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import D3SunBurstChart from './D3SunBurstChart';
import useSizeObserver from '../util/hook/useSizeObserver';
import {useMemo, useRef} from 'react';
import {getBlendColor} from '../util/ColorManager';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';

const SunBurstChart = ({
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
    type: ItemType.SUNBURST_CHART,
    data: mart?.data?.data,
    setItemExports});

  return (
    <Wrapper
      ref={ref}
    >
      <D3SunBurstChart
        dataSource={JSON.parse(mart.data.info.jsonData)}
        palette={palette}
        width={width}
        height={height}
      />
    </Wrapper>
  );
};

export default SunBurstChart;
