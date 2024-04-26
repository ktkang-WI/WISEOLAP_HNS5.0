import * as d3 from 'd3';

// public
const D3PainterForCollapsibleTree = {};

D3PainterForCollapsibleTree.defaultOption = () => {
  return {
    width: 928,
    height: 10,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 40
  };
};

D3PainterForCollapsibleTree.init = ({
  container,
  dataSource,
  defaultOption = D3PainterForCollapsibleTree.defaultOption()
}) => {
  if (!container) return new Error('The Container attribute can\'t be null');
  D3PainterForCollapsibleTree.self = {};
  D3PainterForCollapsibleTree.self.container = container;
  D3PainterForCollapsibleTree.self.data = init.data(dataSource);
  D3PainterForCollapsibleTree.self.option = init.option(defaultOption);
  D3PainterForCollapsibleTree.self.isLoaded = true;
};

D3PainterForCollapsibleTree.painting = () => {
  if (!D3PainterForCollapsibleTree.self.isLoaded) {
    return new Error('D3Init is not loaded!');
  }
  const svg = init.container();
  init.paint.drawing(svg);
};

D3PainterForCollapsibleTree.erasing = () => {
  D3PainterForCollapsibleTree.self.container.innerHTML = '';
};

// private
const init = {};
init.paint = {};

init.paint.drawing = (svg) => {
  const data = D3PainterForCollapsibleTree.self.data;
  const option = D3PainterForCollapsibleTree.self.option;
  const gLink = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5);
  const gNode = svg.append('g')
      .attr('cursor', 'pointer')
      .attr('pointer-events', 'all');

  function update(event, source) {
    const duration = event?.altKey ? 2500 : 250;
    const nodes = data.root.descendants().reverse();
    const links = data.root.links();

    // Compute the new tree layout.
    option.tree(data.root);

    let left = data.root;
    let right = data.root;
    data.root.eachBefore((node) => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + option.marginTop + option.marginBottom;

    const transition = svg.transition()
        .duration(duration)
        .attr('height', height)
        .attr('viewBox',
            [-option.marginLeft,
              left.x - option.marginTop,
              option.width,
              height])
        .tween('resize',
          window.ResizeObserver ? null : () => () => svg.dispatch('toggle'));

    // Update the nodes…
    const node = gNode.selectAll('g').data(nodes, (d) => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append('g')
        .attr('transform', (d) => `translate(${source.y0},${source.x0})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .on('click', (event, d) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        });

    nodeEnter.append('circle')
        .attr('r', 2.5)
        .attr('fill', (d) => d._children ? '#555' : '#999')
        .attr('stroke-width', 10);

    nodeEnter.append('text')
        .attr('dy', '0.31em')
        .attr('x', (d) => d._children ? -6 : 6)
        .attr('text-anchor', (d) => d._children ? 'end' : 'start')
        .text((d) => d.data.name)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .attr('stroke', 'white')
        .attr('paint-order', 'stroke');

    // Transition nodes to their new position.
    node.merge(nodeEnter).transition(transition)
        .attr('transform', (d) => `translate(${d.y},${d.x})`)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1);

    // Transition exiting nodes to the parent's new position.
    node.exit().transition(transition).remove()
        .attr('transform', (d) => `translate(${source.y},${source.x})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

    // Update the links…
    const link = gLink.selectAll('path').data(links, (d) => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append('path')
        .attr('d', (d) => {
          const o = {x: source.x0, y: source.y0};
          return option.diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr('d', option.diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr('d', (d) => {
          const o = {x: source.x, y: source.y};
          return option.diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    data.root.eachBefore((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  data.root.x0 = option.dy / 2;
  data.root.y0 = 0;
  data.root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });
  update(null, data.root);
};

init.data = (dataSource) => {
  const root = d3.hierarchy(dataSource);

  return {
    root,
    dataSource
  };
};

init.option = (option) => {
  const data = D3PainterForCollapsibleTree.self.data;
  const dx = 10;
  const dy = (option.width - option.marginRight - option.marginLeft) /
    (1 + data.root.height);
  const tree = d3.tree().nodeSize([dx, dy]);
  const diagonal = d3.linkHorizontal().x((d) => d.y).y((d) => d.x);
  return {
    ...option,
    dx,
    dy,
    tree,
    diagonal
  };
};

init.container = () => {
  if (!D3PainterForCollapsibleTree.self.container) {
    return new Error('The Container attribute can\'t be null');
  }
  const option = D3PainterForCollapsibleTree.self.option;
  return d3.select(D3PainterForCollapsibleTree.self.container)
      .append('svg')
      .attr('width', option.width)
      .attr('height', option.dx)
      .attr('viewBox',
          [-option.marginLeft, -option.marginTop, option.width, option.dx])
      .attr('style',
          'max-width: 100%;'+
          'height: auto; font: 10px sans-serif; user-select: none;');
};

export default D3PainterForCollapsibleTree;
