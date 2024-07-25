import React, {useRef} from 'react';
import D3BoxPlot from './component/D3BoxPlot';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import useItemSetting from '../util/hook/useItemSetting';
import ItemManager from '../util/ItemManager';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';


const BoxPlot = ({setItemExports, id, item}) => {
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
    type: ItemType.BOX_PLOT,
    data: mart?.data?.data,
    setItemExports});

  return (
    <Wrapper ref={ref}>
      <D3BoxPlot
        width={width}
        height={height}
        data={mart.data}
        id={item.id}
        palette={getPalette()}
        selectedItem={getSelectedItem(true)}
        onClick={setMasterFilterData}
        yAxis={meta.yAxis}
        legend={meta.legend}
        measures={getDataField().measure}
      />
    </Wrapper>
  );
};

export default React.memo(BoxPlot, ItemManager.commonPropsComparator);
