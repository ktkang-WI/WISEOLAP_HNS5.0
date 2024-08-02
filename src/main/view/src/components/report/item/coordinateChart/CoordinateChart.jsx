import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import ItemManager from '../util/ItemManager';
import D3CoordinateChart from './components/D3CoordinateChart';
import React, {useRef} from 'react';
import useSizeObserver from '../util/hook/useSizeObserver';
import useItemSetting from '../util/hook/useItemSetting';

const CoordinateChart = ({setItemExports, id, item, type}) => {
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

  const palette = getPalette();
  const dataField = getDataField();

  return (
    <Wrapper ref={ref}>
      <D3CoordinateChart
        width={width}
        height={height}
        data={mart.data}
        id={item.id}
        palette={palette}
        type={type}
        selectedItem={getSelectedItem(true)}
        onClick={setMasterFilterData}
        legend={meta.legend}
        dataField={dataField}
      />
    </Wrapper>
  );
};

export default React.memo(CoordinateChart, ItemManager.commonPropsComparator);
