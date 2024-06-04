import * as d3 from 'd3';


const D3PainterForZoomableCicle = {};

D3PainterForZoomableCicle.defaultOption = (option) => {
  const radius = Math.min(option.width, option.height) / 2 - 30;
  return {
    width: option?.width || 640,
    height: option?.height || 320,
    cx: (option.width / 2),
    cy: (option.height / 2),
    breadcrumbWidth: 75,
    breadcrumbHeight: 30,
    radius: radius
  };
};

D3PainterForZoomableCicle.init = ({
  container,
  dataSource,
  option,
  defaultOption = D3PainterForZoomableCicle.defaultOption(option)
}) => {
  if (!container) return new Error('The Container attribute can\'t be null');
  D3PainterForZoomableCicle.self = {};
  D3PainterForZoomableCicle.self.container = container;
  D3PainterForZoomableCicle.self.option = defaultOption;
  D3PainterForZoomableCicle.self.data = init.data(dataSource);
  D3PainterForZoomableCicle.self.isLoaded = true;
};

D3PainterForZoomableCicle.painting = () => {
  if (!D3PainterForZoomableCicle.self.isLoaded) {
    return new Error('D3Init is not loaded!');
  }
  const svg = init.container();
  init.paint.drawing(svg);
};

D3PainterForZoomableCicle.erasing = () => {
  D3PainterForZoomableCicle.self.container.innerHTML = '';
};


// private
const init = {};
init.paint = {};
init.funcs = {};
init.funcs.arc = () => {
  const option = D3PainterForZoomableCicle.self.option;
  return d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle(1 / option.radius)
      .padRadius(option.radius)
      .innerRadius((d) => Math.sqrt(d.y0))
      .outerRadius((d) => Math.sqrt(d.y1) - 1);
};

init.funcs.breadcrumbPoints = (d, i) => {
  const option = D3PainterForZoomableCicle.self.option;
  const tipWidth = 10;
  const points = [];
  points.push('0,0');
  points.push(`${option.breadcrumbWidth},0`);
  points.push(`${option.breadcrumbWidth + tipWidth},
    ${option.breadcrumbHeight / 2}`);
  points.push(`${option.breadcrumbWidth},${option.breadcrumbHeight}`);
  points.push(`0,${option.breadcrumbHeight}`);
  if (i > 0) {
    // Leftmost breadcrumb; don't include 6th vertex.
    points.push(`${tipWidth},${breadcrumbHeight / 2}`);
  }
  return points.join(' ');
};
init.funcs.mousearc = () => {
  const option = D3PainterForZoomableCicle.self.option;
  return d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => Math.sqrt(d.y0))
      .outerRadius(option.radius);
};
init.funcs.color = d3
    .scaleOrdinal()
    .domain(['home', 'product', 'search', 'account', 'other', 'end'])
    .range(['#5d85cf', '#7c6561', '#da7847', '#6fb971', '#9e70cf', '#bbbbbb']);

init.funcs.partition = (data) => {
  const option = D3PainterForZoomableCicle.self.option;
  return d3.partition().size([2 * Math.PI, option.radius * option.radius])(
      d3.hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value)
  );
};

init.paint.drawing = (svg) => {
  const option = D3PainterForZoomableCicle.self.option;
  const {root} = D3PainterForZoomableCicle.self.data;
  const element = svg.node();
  element.value = {sequence: [], percentage: 0.0};
  const label = svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', '#888')
      .style('visibility', 'hidden');

  label
      .append('tspan')
      .attr('class', 'percentage')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', '-0.1em')
      .attr('font-size', '3em')
      .text('');

  label
      .append('tspan')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', '1.5em');
  // .text('of visits begin with this sequence');

  svg
      .attr('viewBox', [-option.cx, -option.cy, option.width, option.height])
      .style('max-width', `${option.width}px`)
      .style('font', '12px sans-serif');

  const path = svg
      .append('g')
      .selectAll('path')
      .data(
          root.descendants().filter((d) => {
            return d.depth && d.x1 - d.x0 > 0.001;
          })
      )
      .join('path')
      .attr('fill', (d) => init.funcs.color(d.data.name))
      .attr('d', init.funcs.arc());

  svg
      .append('g')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseleave', () => {
        path.attr('fill-opacity', 1);
        label.style('visibility', 'hidden');
        // Update the value of this view
        element.value = {sequence: [], percentage: 0.0};
        element.dispatchEvent(new CustomEvent('input'));
      })
      .selectAll('path')
      .data(
          root.descendants().filter((d) => {
            return d.depth && d.x1 - d.x0 > 0.001;
          })
      )
      .join('path')
      .attr('d', init.funcs.mousearc())
      .on('mouseenter', (event, d) => {
        // Get the ancestors of the current segment, minus the root
        const sequence = d
            .ancestors()
            .reverse()
            .slice(1);
        // Highlight the ancestors
        path.attr('fill-opacity', (node) =>
          sequence.indexOf(node) >= 0 ? 1.0 : 0.3
        );
        const value =
          d.data.name + ':' + ((100 * d.value) / root.value).toPrecision(3);
        label
            .style('visibility', null)
            .select('.percentage')
            .text(value + '%');
        element.value = {sequence, value};
        element.dispatchEvent(new CustomEvent('input'));
      });
};

init.container = () => {
  if (!D3PainterForZoomableCicle.self.container) {
    return new Error('The Container attribute can\'t be null');
  }
  return d3.select(D3PainterForZoomableCicle.self.container)
      .append('svg');
};

init.data = (dataSource) => {
  const root = init.funcs.partition(dataSource);
  return {
    dataSource,
    root
  };
};


export default D3PainterForZoomableCicle;
