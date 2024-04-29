import * as d3 from 'd3';

// public
const D3PainterForRadialTree = {};

D3PainterForRadialTree.defaultOption = () => {
  const width = 928;
  const height = width;
  const cx = width * 0.5;
  const cy = height * 0.59;
  const radius = Math.min(width, height) / 2 - 30;
  return {
    width,
    height,
    cx,
    cy,
    radius
  };
};

D3PainterForRadialTree.init = ({
  container,
  dataSource,
  defaultOption = D3PainterForRadialTree.defaultOption()
}) => {
  if (!container) return new Error('The Container attribute can\'t be null');
  D3PainterForRadialTree.self = {};
  D3PainterForRadialTree.self.container = container;
  D3PainterForRadialTree.self.option = init.option(defaultOption);
  D3PainterForRadialTree.self.data = init.data(dataSource);
  D3PainterForRadialTree.self.isLoaded = true;
};

D3PainterForRadialTree.painting = () => {
  if (!D3PainterForRadialTree.self.isLoaded) {
    return new Error('D3Init is not loaded!');
  }
  const svg = init.container();
  init.paint.drawing(svg);
};

D3PainterForRadialTree.erasing = () => {
  D3PainterForRadialTree.self.container.innerHTML = '';
};


// private
const init = {};
init.paint = {};

init.paint.drawing = (svg) => {
  const data = D3PainterForRadialTree.self.data;

  svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5)
      .selectAll()
      .data(data.root.links())
      .join('path')
      .attr('d', d3.linkRadial()
          .angle((d) => d.x)
          .radius((d) => d.y));

  svg.append('g')
      .selectAll()
      .data(data.root.descendants())
      .join('circle')
      .attr('transform',
          (d) => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
      .attr('fill', (d) => d.children ? '#555' : '#999')
      .attr('r', 2.5);

  // Append labels.
  svg.append('g')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll()
      .data(data.root.descendants())
      .join('text')
      .attr('transform',
          (d) => `rotate(${d.x * 180 / Math.PI - 90})
          translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
      .attr('dy', '0.31em')
      .attr('x', (d) => d.x < Math.PI === !d.children ? 6 : -6)
      .attr('text-anchor',
          (d) => d.x < Math.PI === !d.children ? 'start' : 'end')
      .attr('paint-order', 'stroke')
      .attr('stroke', 'white')
      .attr('fill', 'currentColor')
      .text((d) => d.data.name);
};

init.data = (dataSource) => {
  const option = D3PainterForRadialTree.self.option;
  const root = option.tree(d3.hierarchy(dataSource)
      .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

  return {
    root,
    dataSource
  };
};

init.option = (option) => {
  const tree = d3.tree()
      .size([2 * Math.PI, option.radius])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
  return {
    ...option,
    tree
  };
};

init.container = () => {
  if (!D3PainterForRadialTree.self.container) {
    return new Error('The Container attribute can\'t be null');
  }
  const option = D3PainterForRadialTree.self.option;
  return d3.select(D3PainterForRadialTree.self.container)
      .append('svg')
      .attr('width', option.width)
      .attr('height', option.height)
      .attr('viewBox', [-option.cx, -option.cy, option.width, option.height])
      .attr('style', 'width: 100%; height: auto; font: 10px sans-serif;');
};

export default D3PainterForRadialTree;
