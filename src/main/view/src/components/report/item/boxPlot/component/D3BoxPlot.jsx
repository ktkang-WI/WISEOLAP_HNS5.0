import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import * as d3 from 'd3';
import {AxisLeft} from './AxisLeft';
import {AxisBottom} from './AxisBottomCategoric';
import {VerticalBox} from './VerticalBox';
import {styled} from 'styled-components';
import {
  getHatchingPattern, getPaletteForD3, getTextWidth
} from '../../util/d3/CanvasUtility';
import valueAxisCustomLabel from '../../ValueAxisCustomLabel';

const StyledWrapper = styled(Wrapper)`
  .box:hover {
    .hatch {
      opacity: 1 !important;
    }
  }
`;

const MARGIN = {top: 10, right: 10, bottom: 30, left: 50};

const D3BoxPlot = ({
  id,
  width,
  height,
  data,
  onClick,
  palette,
  selectedItem = [],
  d3Ref,
  yAxis,
  measures
}) => {
  const info = data.info;
  const yMargin = (info.max - info.min) * 0.1;
  const yDomain = [yAxis.axisStartToZero ||
    Math.floor((info.min - yMargin) / 10) * 10,
  Math.ceil((info.max + yMargin) / 10) * 10];
  const useAxis = yAxis.useAxis ? false : 10;

  const minLabel = valueAxisCustomLabel(yDomain[0], yAxis);
  const maxLabel = valueAxisCustomLabel(yDomain[1], yAxis);
  const axisYMargin = useAxis || Math.max(
      getTextWidth(minLabel, 12), getTextWidth(maxLabel, 12)) + 10 +
      (yAxis.customText ? 15 : 0);

  const boundsWidth = width - MARGIN.right - axisYMargin;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const yScale = d3
      .scaleLinear()
      .domain(yDomain)
      .range([boundsHeight, 0]);

  const xScale = d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(data.data.map((row) => row.name))
      .padding(0.25);

  const d3Palette = getPaletteForD3(palette, data.data.length);

  const allShapes = data.data.map((row, i) => {
    const [min, q1, median, q3, max] = row.data;
    let format = {};
    if (measures.length == 1) {
      format = measures[0].format;
    } else {
      const names = row.name.split(' - ');
      const meaName = names[names.length - 1];

      format = measures.find((mea) => mea.caption == meaName)?.format;
    }

    return (
      <g key={i} transform={`translate(${xScale(row.name)},0)`}>
        <VerticalBox
          data={row}
          selected={selectedItem.includes(row.name)}
          onClick={() => onClick(row.name)}
          tooltipFormat={format}
          width={xScale.bandwidth()}
          q1={yScale(q1)}
          median={yScale(median)}
          q3={yScale(q3)}
          min={yScale(min)}
          max={yScale(max)}
          color={d3Palette[i]}
        />
      </g>
    );
  });

  return (
    <StyledWrapper id={id} ref={d3Ref}>
      <svg width={width} height={height}>
        <defs>
          {getHatchingPattern()}
        </defs>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[axisYMargin, MARGIN.top].join(',')})`}
        >
          <AxisLeft yScale={yScale} yAxis={yAxis}
            pixelsPerTick={50} width={boundsWidth} leftMargin={axisYMargin}/>
          {allShapes}
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom xScale={xScale} width={boundsWidth}/>
          </g>
        </g>
      </svg>
    </StyledWrapper>
  );
};

export default D3BoxPlot;
