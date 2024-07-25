import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import {useRef} from 'react';
import {Funnel} from 'devextreme-react';
import {
  Border,
  Item,
  Label,
  Tooltip
} from 'devextreme-react/funnel';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';

const FunnelChart = ({
  setItemExports,
  id,
  item
}) => {
  const mart = item?.mart;
  const meta = item?.meta;
  if (!mart.init) {
    return <></>;
  }
  const ref = useRef();
  const seriesNames = mart.data.info.seriesMeasureNames;

  const {height, width} = useSizeObserver(ref);

  useItemExport({
    id,
    ref,
    type: ItemType.FUNNEL_CHART,
    data: mart?.data?.data,
    setItemExports});

  return (
    <Wrapper
      ref={ref}
    >
      <Funnel
        width={width}
        height={height}
        dataSource={mart.data.data}
        palette={meta?.palette?.name} // Dev Default blend
        argumentField='arg'
        labelField='arg'
        valueField={seriesNames[0].summaryName}
      >
        <Tooltip enabled={true} format="fixedPoint" />
        <Item>
          <Border visible={true} />
        </Item>
        <Label
          visible={true}
          position="inside"
          backgroundColor="none"
        />
      </Funnel>
    </Wrapper>
  );
};

export default FunnelChart;
