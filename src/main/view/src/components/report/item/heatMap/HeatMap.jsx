import React, {useRef} from 'react';
import ItemManager from 'components/report/item/util/ItemManager';
import D3HeatMap from './D3HeatMap';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';

const HeatMap = ({
  setItemExports,
  id,
  item
}) => {
  const mart = item ? item.mart : null;
  if (!mart.init) {
    return <></>;
  }
  const ref = useRef();
  const seriesNames = mart.data.info.seriesMeasureNames;
  const dimensions = mart.data.info.dimensions;

  const {height, width} = useSizeObserver(ref);
  return (
    <Wrapper
      ref={ref}
    >
      <D3HeatMap
        dataSource={mart.data.data}
        valueField={seriesNames[0].summaryName}
        dimensions={dimensions}
        labelField='arg'
        width={width}
        height={height}
      />
    </Wrapper>
  );
};

export default React.memo(HeatMap, ItemManager.commonPropsComparator);
