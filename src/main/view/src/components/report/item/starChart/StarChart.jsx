import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import {useRef} from 'react';
import {
  PolarChart,
  CommonSeriesSettings,
  Series,
  Tooltip
} from 'devextreme-react/polar-chart';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';

const StarChart = ({
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
    type: ItemType.STAR_CHART,
    data: mart?.data?.data,
    setItemExports});

  return (
    <Wrapper
      ref={ref}
      id={id}
    >
      <PolarChart
        width={width}
        height={height}
        dataSource={mart?.data?.data}
        palette={meta?.palette?.name} // Dev Default blend
        useSpiderWeb={true}
      >
        {
          seriesNames.map(
              (valueField, i) =>
                <Series
                  key={valueField.summaryName+'-'+i}
                  valueField={valueField.summaryName}
                  argumentField='arg'
                  name={valueField.caption || '\u2800'}
                >
                </Series>
          )
        }
        <CommonSeriesSettings type="line" />
        <Tooltip enabled={true} />
      </PolarChart>
    </Wrapper>
  );
};

export default StarChart;
