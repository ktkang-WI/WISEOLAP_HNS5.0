import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import D3ZoomableCicle from './D3ZoomableCicle';
import useSizeObserver from '../util/hook/useSizeObserver';
import {useMemo, useRef} from 'react';
import {getBlendColor} from '../util/ColorManager';

const ZoomableCicle = ({
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
      <D3ZoomableCicle
        dataSource={JSON.parse(mart.data.info.jsonData)}
        palette={palette}
        width={width}
        height={height}
      />
    </Wrapper>
  );
};

export default ZoomableCicle;
