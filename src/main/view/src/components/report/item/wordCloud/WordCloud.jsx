import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import D3WordCloud from './D3WordCloud';
import {useMemo, useRef} from 'react';
import {getBlendColor} from '../util/ColorManager';

const WordCloud = ({
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

  return (
    <Wrapper
      ref={ref}
    >
      <D3WordCloud
        width={width}
        height={height}
        dataSource={mart.data.data}
        valueField={seriesNames[0].summaryName}
        palette={palette}
        labelField='arg'
      />
    </Wrapper>
  );
};

export default WordCloud;
