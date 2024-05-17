import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import * as d3 from 'd3';
import {styled} from 'styled-components';
import {
  getHatchingPattern, getLegendOptions, getPaletteForD3
} from '../../util/d3/CanvasUtility';
import D3Legend from '../../d3/D3Legend';
import {AxisLeft} from '../../d3/AxisLeft';
import {AxisBottom} from '../../d3/AxisBottom';

const StyledWrapper = styled(Wrapper)`
  & .selected {
    opacity: 1 !important;
  }
`;

const MARGIN = 10;

const D3CoordinateChart = ({
  id,
  width,
  height,
  data,
  onClick,
  palette,
  selectedItem = [],
  legend,
  dataField,
  type
}) => {
  const {info} = data;
  const legendData = info.args;
  const {itemWidth, itemHeight, legendOption} = getLegendOptions(
      legend, width, height, info.args);

  const yDomain = [-info.yRange * 1.1, info.yRange * 1.1];
  const xDomain = [-info.xRange * 1.1, info.xRange * 1.1];
  const boundsWidth = itemWidth - MARGIN * 2;
  const boundsHeight = itemHeight - MARGIN * 2;

  const yScale = d3
      .scaleLinear()
      .domain(yDomain)
      .range([boundsHeight, 0]);

  const xScale = d3
      .scaleLinear()
      .range([0, boundsWidth])
      .domain(xDomain);

  const d3Palette = getPaletteForD3(palette, info.args.length);
  const argColors = info.args.reduce((acc, arg, i) => {
    acc[arg] = d3Palette[i];
    return acc;
  }, {});

  const fade = (arg, opacity1, opacity2) => {
    const elements = d3
        .selectAll('#' + id + ' .chart-data').data(info.args);

    elements
        .filter((d) => {
          return d == arg;
        })
        .transition()
        .style('opacity', opacity1);

    elements
        .filter((d) => {
          return d != arg;
        })
        .transition()
        .style('opacity', opacity2);
  };

  const getCircle = () => {
    const x = info.x;
    const y = info.y;

    const groupedData = d3.group(data.data, (d) => d.arg);

    const existSelection = selectedItem && selectedItem.length > 0;

    const circles = info.args.map((arg, i) => (
      <g
        key={'circles-' + i}
        className={'chart-data' +
          (selectedItem.includes(arg) ? ' selected' : '')}
        onClick={() => onClick(arg)}
        onMouseOver={() => fade(arg, 1, 0.1)}
        onMouseOut={() =>
          fade(arg, existSelection ? 0.3 : 1, existSelection ? 0.3 : 1)}
        style={{opacity: existSelection ? 0.3 : 1}}
      >
        {
          groupedData.get(arg).map((row, i) => (
            <circle
              key={'circle-' + i}
              cx={xScale(row[x])}
              cy={yScale(row[y])}
              r="5"
              fill={argColors[row.arg]}/>
          ))
        }
      </g>
    ));

    return (<g>
      {circles}
    </g>);
  };

  const getLine = () => {
    const x = info.x;
    const y = info.y;

    const groupedData = d3.group(data.data, (d) => d.arg);

    groupedData.forEach((value, key) => {
      value.sort((a, b) => a[x] - b[x]);
    });

    const existSelection = selectedItem && selectedItem.length > 0;

    const lines = info.args.map((arg, i) => (
      <path
        key={'line-' + i}
        onClick={() => onClick(arg)}
        className={'chart-data' +
          (selectedItem.includes(arg) ? ' selected' : '')}
        onMouseOver={() => fade(arg, 1, 0.1)}
        onMouseOut={() =>
          fade(arg, existSelection ? 0.3 : 1, existSelection ? 0.3 : 1)}
        style={{opacity: existSelection ? 0.3 : 1}}
        d={d3.line()
            .x((d) => xScale(d[x]))
            .y((d) => yScale(d[y]))(groupedData.get(arg))}
        fill={'none'}
        strokeWidth={3}
        stroke={argColors[arg]}
      />
    ));

    return (<g>
      {lines}
    </g>);
  };

  const methods = {
    'dot': getCircle,
    'line': getLine
  };

  return (
    <D3Legend
      legend={legend}
      legendOption={legendOption}
      palette={d3Palette}
      legendData={legendData}
    >
      <StyledWrapper
        id={id}
        width={itemWidth + 'px'}
        height={itemHeight + 'px'}
      >
        <svg width={itemWidth} height={itemHeight}>
          <defs>
            {getHatchingPattern()}
          </defs>
          <g>
            {methods[type || 'dot']()}
          </g>
          <g
            width={itemWidth}
            height={itemHeight}
            transform={`translate(${[itemWidth / 2, MARGIN].join(',')})`}
          >
            <text
              fontFamily='Noto Sans KR'
              fontSize='12px'
              fill='#767676'
              textAnchor='end'
              transform='translate(-10, 0)'
            >{dataField.y[0].caption}</text>
            <AxisLeft yScale={yScale}
              customFormat={dataField.y[0].format}
              pixelsPerTick={50}/>
          </g>
          <g transform={`translate(${MARGIN + 0.3}, ${itemHeight / 2})`}>
            <text
              fontFamily='Noto Sans KR'
              fontSize='12px'
              fill='#767676'
              textAnchor='end'
              transform={'translate(' + (itemWidth - 10) + ', -10)'}
            >{dataField.x[0].caption}</text>
            <AxisBottom
              xScale={xScale}
              customFormat={dataField.x[0].format}
              width={itemWidth}
              showZero={false}
            />
          </g>
        </svg>
      </StyledWrapper>
    </D3Legend>
  );
};

export default D3CoordinateChart;
