import {darkenColor} from 'components/utils/Color';
import * as d3 from 'd3';
import {getTooltip} from '../utils/BoxPlotUtility';
import {TooltipEvent} from '../../util/d3/EventUtility';

const STROKE_WIDTH = 1.5;

export const VerticalBox = ({
  data,
  min,
  q1,
  median,
  q3,
  max,
  width,
  stroke,
  fill,
  tooltipFormat,
  selected = false,
  onClick
}) => {
  const strokeColor = darkenColor(stroke);
  const start = width * 0.1;
  const end = width * 0.9;

  window.d3 = d3;

  const {onMouseEnter, onMouseMove, onMouseOut} = TooltipEvent;

  return (
    <g className='box'
      onClick={onClick}
      onMouseEnter={() => onMouseEnter(getTooltip(data, tooltipFormat))}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
    >
      <line
        x1={start}
        x2={end}
        y1={min}
        y2={min}
        stroke={strokeColor}
        strokeLinecap='round'
        strokeWidth={STROKE_WIDTH}
        transform={'translate(0, 0.5)'}
      />
      <line
        x1={start}
        x2={end}
        y1={max}
        y2={max}
        strokeLinecap='round'
        stroke={strokeColor}
        transform={'translate(0, 0.5)'}
        strokeWidth={STROKE_WIDTH}
      />
      <line
        x1={width / 2}
        x2={width / 2}
        y1={min}
        y2={max + 1}
        strokeLinecap='round'
        stroke={strokeColor}
        transform={'translate(0.5, 0)'}
        strokeWidth={STROKE_WIDTH}
      />
      <rect
        x={start}
        y={q3}
        width={width * 0.8}
        height={q1 - q3}
        stroke={strokeColor}
        strokeLinecap='round'
        fill={fill}
        strokeWidth={STROKE_WIDTH}
      />
      <rect
        opacity={selected ? '1' : '0'}
        className='hatch'
        x={start}
        y={q3}
        width={width * 0.8}
        height={q1 - q3}
        fill='url(#hatch)'
      />
      <line
        x1={start}
        x2={end}
        y1={median}
        y2={median}
        strokeLinecap='round'
        stroke={strokeColor}
        transform={'translate(0, 0.5)'}
        strokeWidth={STROKE_WIDTH}
      />
    </g>
  );
};
