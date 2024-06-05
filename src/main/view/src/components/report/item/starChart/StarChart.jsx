import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSizeObserver from '../util/hook/useSizeObserver';
import {useRef} from 'react';
import {
  PolarChart,
  CommonSeriesSettings,
  Export,
  Series,
  Tooltip
} from 'devextreme-react/polar-chart';

const StarChart = ({
  setItemExports,
  id,
  item
}) => {
  const mart = item?.mart;
  if (!mart.init) {
    return <></>;
  }
  const ref = useRef();
  const seriesNames = mart.data.info.seriesMeasureNames;

  const {height, width} = useSizeObserver(ref);

  return (
    <Wrapper
      ref={ref}
    >
      <PolarChart
        width={width}
        height={height}
        dataSource={mart?.data?.data}
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
        <Export enabled={true} />
        <Tooltip enabled={true} />
      </PolarChart>
    </Wrapper>
  );
};

export default StarChart;
