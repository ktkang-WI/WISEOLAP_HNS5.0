import * as d3 from 'd3';

// public
const D3PainterForHeatMap = {};

D3PainterForHeatMap.defaultOption = ({
  xDomain,
  yDomain
}) => {
  return {
    width: 1200,
    height: 500,
    margin: {
      top: 50,
      left: 40,
      right: 40,
      bottom: 50
    },
    xDomain: xDomain,
    yDomain: yDomain
  };
};

D3PainterForHeatMap.init = ({
  container,
  dataSource,
  xDomain,
  yDomain,
  defaultOption = D3PainterForHeatMap.defaultOption({xDomain, yDomain})
}) => {
  if (!container) return new Error('The Container attribute can\'t be null');
  D3PainterForHeatMap.self = {};
  D3PainterForHeatMap.self.container = container;
  D3PainterForHeatMap.self.option = init.option(defaultOption);
  D3PainterForHeatMap.self.funcs = init.funcs();
  D3PainterForHeatMap.self.data = dataSource;
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
  const option = D3PainterForHeatMap.self.option;
  const funcs = D3PainterForHeatMap.self.funcs;
  const g = svg.attr('width', option.width - option.margin.left)
      .attr('height', option.height + option.margin.top + option.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + option.margin.left + ', 0)');

  g.append('g')
      .attr('transform', 'translate(0,' + option.height +')')
      .call(d3.axisBottom(funcs.x_scale));
  g.append('g')
      .call(d3.axisLeft(funcs.y_scale));

  svg.selectAll()
      .data(D3PainterForHeatMap.self.data)
      .enter()
      .append('rect')
      .attr('x', (d) => funcs.x_scale(d.x) + option.margin.left)
      .attr('y', (d) => funcs.y_scale(d.y))
      .attr('width', funcs.x_scale.bandwidth())
      .attr('height', (d) => 50)
      .attr('fill', (d) => funcs.color_scale(d.value));
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

init.funcs = () => {
  const option = D3PainterForHeatMap.self.option;
  const xScale =
    d3.scaleBand().domain(option.xDomain).range([0, option.width]);
  const yScale =
    d3.scaleBand().domain(option.yDomain).range([option.height, 0]);
  const colorScale =
    d3.scaleLinear().domain([0, 100]).range(['#fff', '#A3320B']);
  return {
    xScale,
    yScale,
    colorScale
  };
};

init.option = (option) => {
  return {
    ...option
  };
};


export default D3PainterForHeatMap;
