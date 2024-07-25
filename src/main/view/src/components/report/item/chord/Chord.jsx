import React, {useRef} from 'react';
import D3Chord from './component/D3Chord';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import useItemSetting from '../util/hook/useItemSetting';
import ItemManager from '../util/ItemManager';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';


const Chord = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  // const meta = item ? item.meta : null;

  if (!mart.init) {
    return <></>;
  }

  const ref = useRef();
  const {height, width} = useSizeObserver(ref);
  const {itemTools, filterTools} = useItemSetting(item);
  const {getPalette} = itemTools;
  const {setMasterFilterData, getSelectedItem} = filterTools;

  useItemExport({
    id,
    ref,
    type: ItemType.CHORD_DIAGRAM,
    data: mart?.data?.data,
    setItemExports});

  return (
    <Wrapper ref={ref}>
      <D3Chord
        width={width}
        height={height}
        data={mart.data}
        id={item.id}
        palette={getPalette()}
        selectedItem={getSelectedItem()}
        onClick={setMasterFilterData}
      />
    </Wrapper>
  );
};

export default React.memo(Chord, ItemManager.commonPropsComparator);
