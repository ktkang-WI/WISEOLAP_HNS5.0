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
      <D3HeatMap
        dataSource={mart.data.data}
        width={width}
        height={height}
      />
    </Wrapper>
  );
};

export default React.memo(HeatMap, ItemManager.commonPropsComparator);
