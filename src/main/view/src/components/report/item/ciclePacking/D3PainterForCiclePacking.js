import * as d3 from 'd3';


const D3PainterForSunBurstChart = {};

D3PainterForSunBurstChart.defaultOption = (option) => {
  const radius = Math.min(option.width, option.height) / 2 - 30;
  return {
    width: option?.width || 640,
    height: option?.height || 320,
    cx: (option.width / 2),
    cy: (option.height / 2),
    breadcrumbWidth: 75,
    breadcrumbHeight: 30,
    radius: radius,
    margin: 1
  };
};

D3PainterForSunBurstChart.init = ({
  container,
  dataSource,
  option,
  defaultOption = D3PainterForSunBurstChart.defaultOption(option)
}) => {
  if (!container) return new Error('The Container attribute can\'t be null');
  D3PainterForSunBurstChart.self = {};
  D3PainterForSunBurstChart.self.container = container;
  D3PainterForSunBurstChart.self.option = defaultOption;
  D3PainterForSunBurstChart.self.data = init.data(dataSource);
  D3PainterForSunBurstChart.self.isLoaded = true;
};

D3PainterForSunBurstChart.painting = () => {
  if (!D3PainterForSunBurstChart.self.isLoaded) {
    return new Error('D3Init is not loaded!');
  }
  const svg = init.container();
  init.paint.drawing(svg);
};

D3PainterForSunBurstChart.erasing = () => {
  D3PainterForSunBurstChart.self.container.innerHTML = '';
};


// private
const init = {};
init.paint = {};
init.funcs = {};

init.funcs.color = d3
    .scaleOrdinal()
    .domain(['home', 'product', 'search', 'account', 'other', 'end'])
    .range(['#5d85cf', '#7c6561', '#da7847', '#6fb971', '#9e70cf', '#bbbbbb']);

init.funcs.partition = (data) => {
  const option = D3PainterForSunBurstChart.self.option;
  const pack = d3.pack()
      .size([option.width - option.margin * 2,
        option.height - option.margin * 2])
      .padding(3);
  return pack(d3.hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value));
};

init.paint.drawing = (svg) => {
  const {root} = D3PainterForSunBurstChart.self.data;
  const format = d3.format(',d');
  const node = svg.append('g')
      .selectAll()
      .data(root.descendants())
      .join('g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);
  node.append('title')
      .text((d) =>`${d.ancestors().map((d) =>
        d.data.name).reverse().join('/')}\n${format(d.value)}`);

  node.append('circle')
      .attr('fill', (d) => d.children ? '#fff' : '#ddd')
      .attr('stroke', (d) => d.children ? '#bbb' : null)
      .attr('r', (d) => d.r);

  // Add a label to leaf nodes.
  const text = node
      .filter((d) => !d.children && d.r > 10)
      .append('text')
      .attr('clip-path', (d) => `circle(${d.r})`);

  // Add a tspan for each CamelCase-separated word.
  text.selectAll()
      .data((d) => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
      .join('tspan')
      .attr('x', 0)
      .attr('y', (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
      .text((d) => d);

  // Add a tspan for the node’s value.
  text.append('tspan')
      .attr('x', 0)
      .attr('y', (d) =>
        `${d.data.name.split(/(?=[A-Z][a-z])|\s+/g).length / 2 + 0.35}em`)
      .attr('fill-opacity', 0.7)
      .text((d) => format(d.value));
};

init.container = () => {
  if (!D3PainterForSunBurstChart.self.container) {
    return new Error('The Container attribute can\'t be null');
  }
  const option = D3PainterForSunBurstChart.self.option;
  return d3.select(D3PainterForSunBurstChart.self.container)
      .append('svg')
      .attr('width', option.width)
      .attr('height', option.height)
      .attr('viewBox', [-option.margin, -option.margin,
        option.width, option.height])
      .attr('style', 'width: 100%; height: auto; font: 10px sans-serif;')
      .attr('text-anchor', 'middle');
};

init.data = (dataSource) => {
  const root = init.funcs.partition(dataSource);
  return {
    dataSource,
    root
  };
};


export default D3PainterForSunBurstChart;
