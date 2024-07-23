import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import React, {useRef} from 'react';
import D3RadialTree from './D3RadialTree';
import ItemManager from 'components/report/item/util/ItemManager';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';

const RadialTree = ({
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

  useItemExport({
    id,
    ref,
    type: ItemType.RADIAL_TREE,
    data: mart?.data?.data,
    setItemExports});

  return (
    <Wrapper
      ref={ref}
    >
      <D3RadialTree
        dataSource={JSON.parse(mart.data.info.jsonData)}
        width={width}
        height={height}
      />
    </Wrapper>
  );
};

export default React.memo(RadialTree, ItemManager.commonPropsComparator);
