import * as d3 from 'd3';


const D3PainterForHierarchicalChart = {};

D3PainterForHierarchicalChart.defaultOption = (option) => {
  const radius = Math.min(option.width, option.height) / 2 - 30;
  return {
    width: option.width,
    height: option.height,
    cx: (option.width / 2),
    cy: (option.height / 2),
    radius: radius
  };
};

D3PainterForHierarchicalChart.init = ({
  container,
  dataSource,
  option,
  defaultOption = D3PainterForHierarchicalChart.defaultOption(option)
}) => {
  if (!container) return new Error('The Container attribute can\'t be null');
  D3PainterForHierarchicalChart.self = {};
  D3PainterForHierarchicalChart.self.container = container;
  D3PainterForHierarchicalChart.self.option = defaultOption;
  D3PainterForHierarchicalChart.self.data = init.data(dataSource);
  D3PainterForHierarchicalChart.self.isLoaded = true;
};

D3PainterForHierarchicalChart.painting = () => {
  if (!D3PainterForHierarchicalChart.self.isLoaded) {
    return new Error('D3Init is not loaded!');
  }
  const svg = init.container();
  init.paint.drawing(svg);
};

D3PainterForHierarchicalChart.erasing = () => {
  D3PainterForHierarchicalChart.self.container.innerHTML = '';
};


// private
const init = {};
init.paint = {};

init.paint.drawing = (svg) => {
  const data = D3PainterForHierarchicalChart.self.data;

  // 마우스가 노드 위에 올라갔을 때 툴팁을 보여줌
  const showTooltip = (event) => {
    const tooltip = d3.select('#tooltip');
    tooltip.style('display', 'block')
        .style('left', (event.pageX) + 'px')
        .style('top', (event.pageY - 28) + 'px')
        .html(event.target.__data__.data.name + ': ' +
        event.target.__data__.data.value);
  };

  // 마우스가 노드 위에서 벗어났을 때 툴팁을 숨김
  const hideTooltip = () => {
    const tooltip = d3.select('#tooltip');
    tooltip.style('display', 'none');
  };
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

  // Append nodes.
  svg.append('g')
      .selectAll()
      .data(data.root.descendants())
      .join('circle')
      .attr('transform', (d) =>
        `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
      .attr('fill', (d) => d.children ? '#555' : '#999')
      .attr('r', 2.5);

  // Append labels.
  svg.append('g')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll()
      .data(data.root.descendants())
      .join('text')
      .attr('font-size', '16px')
      .attr('transform', (d) =>
        `rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
      .attr('dy', '0.31em')
      .attr('x', (d) => d.x < Math.PI === !d.children ? 6 : -6)
      .attr('text-anchor', (d) =>
        d.x < Math.PI === !d.children ? 'start' : 'end')
      .attr('paint-order', 'stroke')
      .attr('stroke', 'white')
      .attr('fill', 'currentColor')
      .text((d) => d.data.name)
      .on('mouseover', (e) => showTooltip(e))
      .on('mouseout', (e) => hideTooltip(e));


  d3.select('body').append('div')
      .attr('id', 'tooltip')
      .style('display', 'none')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '1px solid black')
      .style('padding', '5px');
};

init.container = () => {
  if (!D3PainterForHierarchicalChart.self.container) {
    return new Error('The Container attribute can\'t be null');
  }
  const option = D3PainterForHierarchicalChart.self.option;
  return d3.select(D3PainterForHierarchicalChart.self.container)
      .append('svg')
      .attr('width', option.width)
      .attr('height', option.height)
      .attr('viewBox', [-option.cx, -option.cy, option.width, option.height])
      .attr('style', 'width: 100%; height: auto; font: 10px sans-serif;');
};

init.data = (dataSource) => {
  const option = D3PainterForHierarchicalChart.self.option;
  const tree = d3.cluster()
      .size([2 * Math.PI, option.radius])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
  const root = tree(d3.hierarchy(dataSource)
      .sort((a, b) => d3.ascending(a.data.name, b.data.name)));
  return {
    dataSource,
    root
  };
};


export default D3PainterForHierarchicalChart;
