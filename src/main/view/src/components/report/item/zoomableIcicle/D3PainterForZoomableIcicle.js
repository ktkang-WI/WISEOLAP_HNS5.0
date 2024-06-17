import * as d3 from 'd3';


const D3PainterForZoomableIcicle = {};

D3PainterForZoomableIcicle.defaultOption = (option) => {
  return {
    width: option?.width,
    height: option?.height,
    palette: option.palette
  };
};

D3PainterForZoomableIcicle.init = ({
  container,
  dataSource,
  option,
  defaultOption = D3PainterForZoomableIcicle.defaultOption(option)
}) => {
  if (!container) return new Error('The Container attribute can\'t be null');
  D3PainterForZoomableIcicle.self = {};
  D3PainterForZoomableIcicle.self.container = container;
  D3PainterForZoomableIcicle.self.option = defaultOption;
  D3PainterForZoomableIcicle.self.data = init.data(dataSource);
  D3PainterForZoomableIcicle.self.isLoaded = true;
};

D3PainterForZoomableIcicle.painting = () => {
  if (!D3PainterForZoomableIcicle.self.isLoaded) {
    return new Error('D3Init is not loaded!');
  }
  const svg = init.container();
  init.paint.drawing(svg);
};

D3PainterForZoomableIcicle.erasing = () => {
  D3PainterForZoomableIcicle.self.container.innerHTML = '';
};


// private
const init = {};
init.paint = {};
init.funcs = {};
init.funcs.partition = (data) => {
  const option = D3PainterForZoomableIcicle.self.option;
  const partition = d3.partition()
      .size([option.height, option.width])
      .padding(1);

  return partition(d3.hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value));
};

init.paint.drawing = (svg) => {
  const option = D3PainterForZoomableIcicle.self.option;
  const {root} = D3PainterForZoomableIcicle.self.data;
  const format = d3.format(',d');
  const cell = svg
      .selectAll()
      .data(root.descendants())
      .join('g')
      .attr('transform', (d) => `translate(${d.y0},${d.x0})`);

  cell.append('title')
      .text((d) =>
        `${d.ancestors().map((d) =>
          d.data.name).reverse().join('/')}\n${format(d.value)}`);

  cell.append('rect')
      .attr('width', (d) => d.y1 - d.y0)
      .attr('height', (d) => d.x1 - d.x0)
      .attr('fill-opacity', 0.6)
      .attr('fill', (d, i) => {
        if (!d.depth) return '#ccc';
        while (d.depth > 1) d = d.parent;
        return option.palette[i];
      });

  // Add labels and a title.
  const text = cell.filter((d) => (d.x1 - d.x0) > 16).append('text')
      .attr('x', 4)
      .attr('y', 13);

  text.append('tspan')
      .text((d) => d.data.name);

  text.append('tspan')
      .attr('fill-opacity', 0.7)
      .text((d) => ` ${format(d.value)}`);
};

init.container = () => {
  if (!D3PainterForZoomableIcicle.self.container) {
    return new Error('The Container attribute can\'t be null');
  }
  const option = D3PainterForZoomableIcicle.self.option;
  return d3.select(D3PainterForZoomableIcicle.self.container)
      .append('svg')
      .attr('viewBox', [0, 0, option.width, option.height])
      .attr('width', option.width)
      .attr('height', option.height)
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');
};

init.data = (dataSource) => {
  const root = init.funcs.partition(dataSource);
  return {
    dataSource,
    root
  };
};


export default D3PainterForZoomableIcicle;
