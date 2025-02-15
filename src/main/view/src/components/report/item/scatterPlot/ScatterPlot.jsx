import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import React, {useRef} from 'react';
import useSizeObserver from '../util/hook/useSizeObserver';
import D3ScatterPlot from './D3ScatterPlot';
import ItemManager from '../util/ItemManager';
import ItemType from '../util/ItemType';
import useItemExport from 'hooks/useItemExport';

const ScatterPlot = ({setItemExports, id, item}) => {
  const mart = item?.mart;

  if (!mart.init) {
    return <></>;
  }

  const ref = useRef();

  useItemExport({
    id,
    ref,
    type: ItemType.SCATTER_PLOT,
    data: mart?.data?.data,
    setItemExports});

  const {height, width} = useSizeObserver(ref);

  return (
    <Wrapper
      ref={ref}
      id={id}>
      <D3ScatterPlot
        dataSource={mart?.data}
        width={width}
        height={height}
      />
    </Wrapper>
  );
};

export default React.memo(ScatterPlot, ItemManager.commonPropsComparator);
