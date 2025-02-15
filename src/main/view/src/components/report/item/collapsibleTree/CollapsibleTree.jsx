import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import D3CollapsibleTree from './D3CollapsibleTree';
import React, {useRef} from 'react';
import useSizeObserver from '../util/hook/useSizeObserver';
import ItemManager from 'components/report/item/util/ItemManager';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';

const CollapsibleTree = ({
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
    type: ItemType.COLLAPSIBLE_TREE,
    data: mart?.data?.data,
    setItemExports});

  return (
    <Wrapper
      ref={ref}
      id={id}
    >
      <D3CollapsibleTree
        dataSource={JSON.parse(mart.data.info.jsonData)}
        width={width}
        height={height}
      />
    </Wrapper>
  );
};

export default React.memo(CollapsibleTree, ItemManager.commonPropsComparator);
