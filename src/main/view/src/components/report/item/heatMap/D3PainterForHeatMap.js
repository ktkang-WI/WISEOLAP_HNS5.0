import * as d3 from 'd3';

// public
const D3PainterForHeatMap = {};

D3PainterForHeatMap.defaultOption = (option) => {
  return {
    width: option.width,
    height: option.height - 50,
    margin: {
      top: 50,
      left: 40,
      right: 40,
      bottom: 50
    }
  };
};

D3PainterForHeatMap.init = ({
  container,
  dataSource,
  option,
  xDomain,
  yDomain,
  defaultOption = D3PainterForHeatMap.defaultOption(option)
}) => {
  if (!container) return new Error('The Container attribute can\'t be null');
  D3PainterForHeatMap.self = {};
  D3PainterForHeatMap.self.container = container;
  D3PainterForHeatMap.self.option = init.option(defaultOption);
  D3PainterForHeatMap.self.data = {
    dataSource: dataSource,
    xDomain: xDomain,
    yDomain: yDomain
  };
  D3PainterForHeatMap.self.isLoaded = true;
};

D3PainterForHeatMap.painting = () => {
  if (!D3PainterForHeatMap.self.isLoaded) {
    return new Error('D3Init is not loaded!');
  }
  const svg = init.container();
  init.paint.drawing(svg);
};

D3PainterForHeatMap.erasing = () => {
  D3PainterForHeatMap.self.container.innerHTML = '';
};

// private
const init = {};
init.paint = {};
init.paint.drawing = (svg) => {
  const {dataSource, xDomain, yDomain} = D3PainterForHeatMap.self.data;
  const option = D3PainterForHeatMap.self.option;
  const g = svg.attr('width', option.width - option.margin.left)
      .attr('height', option.height + option.margin.top + option.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + option.margin.left + ', 0)');

  const xScale =
      d3.scaleBand().domain(xDomain).range([0, option.width]);
  const yScale =
      d3.scaleBand().domain(yDomain).range([option.height, 0]);
  const colorScale =
    d3.scaleLinear().domain([0, 100]).range(['#fff', '#A3320B']);

  g.append('g')
      .attr('transform', 'translate(0,' + option.height +')')
      .call(d3.axisBottom(xScale));
  g.append('g')
      .call(d3.axisLeft(yScale));

  svg.selectAll()
      .data(dataSource)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.x) + option.margin.left)
      .attr('y', (d) => yScale(d.y))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => 50)
      .attr('fill', (d) => colorScale(d.value));
};

init.container = () => {
  if (!D3PainterForHeatMap.self.container) {
    return new Error('The Container attribute can\'t be null');
  }
  const option = D3PainterForHeatMap.self.option;
  return d3.select(D3PainterForHeatMap.self.container)
      .append('svg')
      .attr('width', option.width - option.margin.left)
      .attr('height', option.height + option.margin.top + option.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + option.margin.left + ', 0)');
};

init.option = (option) => {
  return {
    ...option
  };
};


export default D3PainterForHeatMap;
