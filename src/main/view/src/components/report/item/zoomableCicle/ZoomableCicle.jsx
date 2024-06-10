import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import D3ZoomableCicle from './D3ZoomableCicle';
import useSizeObserver from '../util/hook/useSizeObserver';
import {useRef} from 'react';

const ZoomableCicle = ({
  setItemExports,
  id,
  item
}) => {
  const mart = item?.mart;
  if (!mart.init) {
    return <></>;
  }
  const ref = useRef();
  const {height, width} = useSizeObserver(ref);
  return (
    <Wrapper
      ref={ref}
    >
      <D3ZoomableCicle
        dataSource={JSON.parse(mart.data.info.jsonData)}
        width={width}
        height={height}
      />
    </Wrapper>
  );
};

export default ZoomableCicle;
