import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import D3ZoomableIcicle from './D3ZoomableIcicle';
import useSizeObserver from '../util/hook/useSizeObserver';
import {useMemo, useRef} from 'react';
import {getBlendColor} from '../util/ColorManager';

const ZoomableIcicle = ({
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
  return (
    <Wrapper
      ref={ref}
    >
      <D3ZoomableIcicle
        dataSource={JSON.parse(mart.data.info.jsonData)}
        palette={palette}
        width={width}
        height={height}
      />
    </Wrapper>
  );
};

export default ZoomableIcicle;
