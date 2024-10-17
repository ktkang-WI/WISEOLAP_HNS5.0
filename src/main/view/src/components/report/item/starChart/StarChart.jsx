import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {useRef} from 'react';
import {
  PolarChart,
  CommonSeriesSettings,
  Series,
  Tooltip
} from 'devextreme-react/polar-chart';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';
import {formatNumber, generateLabelSuffix}
  from 'components/utils/NumberFormatUtility';
import useItemSetting from '../util/hook/useItemSetting';

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
  const {itemTools} = useItemSetting(item);
  const {getDataField} = itemTools;

  useItemExport({
    id,
    ref,
    type: ItemType.STAR_CHART,
    data: mart?.data?.data,
    setItemExports});

  const formats = getDataField().measure.reduce((acc, mea) => {
    acc[mea.caption] = mea.format;
    return acc;
  }, {});

  return (
    <Wrapper
      id={id}
    >
      <PolarChart
        width={'100%'}
        height={'100%'}
        ref={ref}
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
        <Tooltip
          enabled={true}
          customizeTooltip={(e, arg) => {
            const format = formats[e.seriesName];

            const labelSuffix = generateLabelSuffix(format);
            const tooltipValue =
              formatNumber(e.value, format, labelSuffix);
            return {
              text: `<b>${e.argument}</b><br/><b>${e.seriesName}</b>: ` +
                `<p>${tooltipValue}</p>`
            };
          }}
        />
      </PolarChart>
    </Wrapper>
  );
};

export default StarChart;
