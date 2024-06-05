import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import {useRef} from 'react';
import D3WaterFall from './D3WaterFall';

const WaterFall = ({
  setItemExports,
  id,
  item
}) => {
  const mart = item?.mart;
  if (!mart.init) {
    return <></>;
  }
  const ref = useRef();
  const seriesNames = mart.data.info.seriesMeasureNames;

  const {height, width} = useSizeObserver(ref);

  return (
    <Wrapper
      ref={ref}
    >
      <D3WaterFall
        width={width}
        height={height}
        dataSource={mart.data.data}
        valueField={seriesNames[0].summaryName}
        labelField='arg'
      />
    </Wrapper>
  );
};

export default WaterFall;
