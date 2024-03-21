import {useMemo} from 'react';
import {getTextWidth} from '../../util/d3/CanvasUtility';

// tick length
const TICK_LENGTH = 6;

export const AxisBottom = ({xScale, width}) => {
  const [min, max] = xScale.range();

  const ticks = useMemo(() => {
    return xScale.domain().map((value) => ({
      value,
      xOffset: xScale(value) + xScale.bandwidth() / 2
    }));
  }, [xScale]);

  let beforeLegendX = -5000;

  return (
    <>
      {/* Main horizontal line */}
      <path
        d={['M', min - 6, 0, 'L', max, 0].join(' ')}
        fill='none'
        stroke='#767676'
        strokeWidth='1'
        transform={`translate(0, 0.5)`}
      />

      {/* Ticks and labels */}
      {ticks.reduce((acc, {value, xOffset}) => {
        let element;

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
                {value}
              </text>
            </g>
          );
        }

        acc.push(element);

        return acc;
      }, [])}
    </>
  );
};
