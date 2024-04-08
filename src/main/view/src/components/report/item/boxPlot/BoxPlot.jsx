import React, {useRef} from 'react';
import D3BoxPlot from './component/D3BoxPlot';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import useItemSetting from '../util/hook/useItemSetting';


const BoxPlot = ({item}) => {
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

  return (
    <Wrapper ref={ref}>
      <D3BoxPlot
        width={width}
        height={height}
        data={mart.data}
        id={item.id}
        palette={getPalette()}
        selectedItem={getSelectedItem()}
        onClick={setMasterFilterData}
        yAxis={meta.yAxis}
        legend={meta.legend}
        measures={getDataField().measure}
      />
    </Wrapper>
  );
};

export default React.memo(BoxPlot);
