import React, {useRef} from 'react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import D3ArcDiagram from './component/D3ArcDiagram';
import useSizeObserver from '../util/hook/useSizeObserver';
import useItemSetting from '../util/hook/useItemSetting';
import ItemManager from '../util/ItemManager';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';

const ArcDiagram = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;

  if (!mart.init) {
    return <></>;
  }

  const ref = useRef();
  const {height, width} = useSizeObserver(ref);
  const {itemTools, filterTools} = useItemSetting(item);
  const {getDataField, getPalette} = itemTools;
  const {setMasterFilterData, getSelectedItem} = filterTools;

  useItemExport({
    id,
    ref,
    type: ItemType.ARC_DIAGRAM,
    data: mart?.data?.data,
    setItemExports});

  return (
    <Wrapper ref={ref}>
      <D3ArcDiagram
        width={width}
        height={height}
        data={mart.data}
        id={item.id}
        dimensions={getDataField().dimension}
        palette={getPalette()}
        rotated={meta.useRotate}
        legend={meta.legend}
        selectedItem={getSelectedItem()}
        onClick={setMasterFilterData}
      />
    </Wrapper>
  );
};

export default React.memo(ArcDiagram, ItemManager.commonPropsComparator);
