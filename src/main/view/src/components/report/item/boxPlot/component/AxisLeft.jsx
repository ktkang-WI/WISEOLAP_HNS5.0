import {useMemo} from 'react';
import valueAxisCustomLabel from '../../ValueAxisCustomLabel';

const TICK_LENGTH = 6;

export const AxisLeft = ({
  yScale, pixelsPerTick, width=0, yAxis, leftMargin=0
}) => {
  const range = yScale.range();

  const ticks = useMemo(() => {
    const height = range[0] - range[1];
    const numberOfTicksTarget = Math.floor(height / pixelsPerTick);

    return yScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      yOffset: yScale(value)
    }));
  }, [yScale]);

  return (
    <>
      {/* Main vertical line */}
      {yAxis?.useAxis && yAxis?.customText &&
        <text
          fill={'#767676'}
          style={{
            fontSize: '14px',
            textAnchor: 'middle',
            fontFamily: 'Noto Sans KR',
            transform: 'translate(-' +
              (leftMargin - 12) +'px, ' +
              ((range[0] - range[1]) / 2) + 'px) rotate(-90deg)'
          }}
        >
          {yAxis.customText}
        </text>
      }
      <path
        d={['M', 0, range[0], 'L', 0, range[1]].join(' ')}
        fill='none'
        transform={'translate(0.5, 0)'}
        stroke='#767676'
        strokeWidth='1'
      />
      {/* Ticks and labels */}
      {ticks.map(({value, yOffset}) => (
        <g key={value} transform={`translate(0, ${yOffset})`}>
          <line
            x2={-TICK_LENGTH}
            stroke='#767676'
            transform={'translate(0, 0.5)'}
          />
          {width &&
            <line
              x2={width}
              stroke='#d3d3d3'
              transform={'translate(0, 0.5)'}
            />
          }
          <text
            key={value}
            fill={'#767676'}
            style={{
              fontSize: '12px',
              textAnchor: 'end',
              fontFamily: 'Noto Sans KR',
              transform: 'translate(-10px, 5px)'
            }}
          >
            {yAxis ? valueAxisCustomLabel(value, yAxis) : value}
          </text>
        </g>
      ))}
    </>
  );
};
