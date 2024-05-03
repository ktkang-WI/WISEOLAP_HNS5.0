import {useMemo} from 'react';
import {getTextWidth} from '../util/d3/CanvasUtility';
import {formatNumber, generateLabelSuffix}
  from 'components/utils/NumberFormatUtility';

// tick length
const TICK_LENGTH = 6;

export const AxisBottom = ({
  xScale,
  width,
  pixelsPerTick=50,
  showZero = true,
  customFormat
}) => {
  const [min, max] = xScale.range();

  const ticks = useMemo(() => {
    const numberOfTicksTarget = Math.floor(width / pixelsPerTick);

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value)
    }));
  }, [xScale]);

  let beforeLegendX = -5000;
  let labelSuffix = false;

  if (customFormat) {
    labelSuffix = generateLabelSuffix(customFormat);
  }

  return (
    <>
      {/* Main horizontal line */}
      <path
        d={['M', min - 6, 0, 'L', max, 0].join(' ')}
        fill='none'
        stroke='#767676'
        strokeWidth='1'
        transform={`translate(0.5, 0)`}
      />

      {/* Ticks and labels */}
      {ticks.map(({value, xOffset}) => {
        let element;

        if (value == 0 && !showZero) return (<></>);

        const textWidth = getTextWidth(value, 12, 'Noto Sans KR') / 2;

        if (xOffset - textWidth < beforeLegendX ||
          xOffset + textWidth > width) {
          element = (
            <g key={value} transform={`translate(${xOffset}, 0)`}>
              <line y2={TICK_LENGTH} stroke='#767676' />
            </g>
          );
        } else {
          beforeLegendX = xOffset + textWidth;

          element = (
            <g key={value} transform={`translate(${xOffset}, 0)`}>
              <line y2={TICK_LENGTH} stroke='#767676' />
              <text
                key={value}
                fill={'#767676'}
                style={{
                  fontSize: '12px',
                  fontFamily: 'Noto Sans KR',
                  textAnchor: 'middle',
                  transform: 'translateY(20px)'
                }}
              >
                {labelSuffix ? formatNumber(value, customFormat, labelSuffix) :
            value}
              </text>
            </g>
          );
        }

        return element;
      })}
    </>
  );
};
