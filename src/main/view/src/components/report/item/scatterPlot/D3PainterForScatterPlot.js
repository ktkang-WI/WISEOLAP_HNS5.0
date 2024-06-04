import * as d3 from 'd3';


// public
const D3PainterForScatter = {};

D3PainterForScatter.defaultOption = (option) => {
  return {
    margin: {top: 50, right: 100, bottom: 50, left: 50},
    width: option.width,
    height: option.height
  };
};

D3PainterForScatter.init = ({
  container,
  dataSource,
  option,
  defaultOption = D3PainterForScatter.defaultOption(option)
}) => {
  if (!container) return new Error('The Container attribute can\'t be null');
  D3PainterForScatter.self = {};
  D3PainterForScatter.self.container = container;
  D3PainterForScatter.self.option = defaultOption;
  D3PainterForScatter.self.data = init.data(dataSource);
  D3PainterForScatter.self.isLoaded = true;
};

D3PainterForScatter.painting = () => {
  if (!D3PainterForScatter.self.isLoaded) {
    return new Error('D3Init is not loaded!');
  }
  const svg = init.container();
  init.paint.drawing(svg);
};

D3PainterForScatter.erasing = () => {
  D3PainterForScatter.self.container.innerHTML = '';
};

// private
const init = {};
init.paint = {};

init.paint.drawing = (svg) => {
  const data = D3PainterForScatter.self.data.dataSource;
  const option = D3PainterForScatter.self.option;
  const x = d3
      .scaleLinear()
      .domain([d3.min(data, (d) =>
        Number(d.x)), d3.max(data, (d) => Number(d.x)) + 20])
      .range([option.margin.left, option.width - option.margin.right])
      .nice();
  const y = d3
      .scaleLinear()
      .domain([d3.min(data, (d) =>
        Number(d.y)), d3.max(data, (d) => Number(d.y)) + 20])
      .range([option.height - option.margin.bottom, option.margin.top])
      .nice();

  const xAxis = d3
      .axisBottom()
      .scale(x)
      .ticks(10)
      .tickSize(-(option.height - option.margin.top - option.margin.bottom));

  const yAxis = d3
      .axisLeft()
      .scale(y)
      .ticks(10)
      .tickSize(-(option.width - option.margin.left - option.margin.right));

  svg
      .append('g')
      .attr('transform', `translate(0,${option.height - option.margin.bottom})`)
      .call(xAxis);

  svg
      .append('g')
      .attr('transform', `translate(${option.margin.left}, 0)`)
      .call(yAxis);

  svg.selectAll('.tick').select('line').attr('stroke', '#E5E7EB');

  svg
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('id', 'circle')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 6);

  svg
      .append('g')
      .selectAll('text')
      .data(data)
      .join('text')
      .text((d) => d.name)
      .attr('text-anchor', 'middle')
      .attr('x', (d) => x(d.x))
      .attr('y', (d) => y(d.y) - 10)
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10);

  svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('color', '#E5E7EB')
      .attr('x', option.width / 2)
      .attr('y', option.height - 14)
      .text('x (in millions of USD)');

  svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('color', '#E5E7EB')
      .attr('x', option.width / 2)
      .attr('y', option.height - 14)
      .attr('x', -(option.height / 2))
      .attr('y', -30 )
      .text('↑ millions of inhabitants')
      .attr('transform', 'rotate(-90)');
};

init.container = () => {
  if (!D3PainterForScatter.self.container) {
    return new Error('The Container attribute can\'t be null');
  }
  const option = D3PainterForScatter.self.option;
  return d3.select(D3PainterForScatter.self.container)
      .append('svg')
      .attr('width', option.width)
      .attr('height', option.height);
};

init.data = (dataSource) => {
  return {
    dataSource
  };
};

export default D3PainterForScatter;
