import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import D3WordCloud from './D3WordCloud';
import {useRef} from 'react';

const WordCloud = ({
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
      <D3WordCloud
        width={width}
        height={height}
        dataSource={mart.data.data}
        valueField={seriesNames[0].summaryName}
        labelField='arg'
      />
    </Wrapper>
  );
};

export default WordCloud;
