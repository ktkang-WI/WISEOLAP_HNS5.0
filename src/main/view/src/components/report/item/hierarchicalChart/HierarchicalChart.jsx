import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import D3HierarchicalChart from './D3HierarchicalChart';
import useSizeObserver from '../util/hook/useSizeObserver';
import {useRef} from 'react';

const HierarchicalChart = ({
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
      <D3HierarchicalChart
        dataSource={JSON.parse(mart.data.info.jsonData)}
        width={width}
        height={height}
      />
    </Wrapper>
  );
};

export default HierarchicalChart;
