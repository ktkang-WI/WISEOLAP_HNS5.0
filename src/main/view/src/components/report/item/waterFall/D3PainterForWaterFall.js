import * as d3 from 'd3';

// public
const D3PainterForWaterFall = {};

D3PainterForWaterFall.defaultOption = () => {
  return {
    width: 800,
    height: 450,
    margin: {top: 20, right: 30, bottom: 30, left: 50},
    padding: 0.3
  };
};

D3PainterForWaterFall.init = ({
  container,
  dataSource,
  valueField,
  labelField,
  defaultOption = D3PainterForWaterFall.defaultOption()
}) => {
  if (!container) {
    return new Error('The Container attribute can\'t be null');
  };
  D3PainterForWaterFall.self = {};
  D3PainterForWaterFall.self.container = container;
  D3PainterForWaterFall.self.option = defaultOption;
  D3PainterForWaterFall.self.funcs = init.funcs;
  D3PainterForWaterFall.self.data = {
    dataSource: dataSource,
    valueField: valueField,
    labelField: labelField
  };
  D3PainterForWaterFall.self.isLoaded = true;
};

D3PainterForWaterFall.painting = () => {
  if (!D3PainterForWaterFall.self.isLoaded) {
    return new Error('D3Init is not loaded!');
  }
  const svg = init.container();
  init.paint.drawing(svg);
};

D3PainterForWaterFall.erasing = () => {
  D3PainterForWaterFall.self.container.innerHTML = '';
};

// private
const init = {};
init.paint = {};
init.paint.drawing = (svg) => {
  // const data = D3PainterForWaterFall.self.data;
  const option = D3PainterForWaterFall.self.option;
  const {dataSource, valueField, labelField} = D3PainterForWaterFall.self.data;
  // Calculate the cumulative values and adjust for the last bar
  let cumulative = 0;
  const cumulativeData = dataSource.map((d, i) => {
    if (i === dataSource.length - 1) {
      return {...d, cumulative: 0, start: cumulative};
    }
    cumulative += d[valueField];
    return {...d, cumulative: cumulative};
  });

  // Set up scales
  const x = d3.scaleBand()
      .domain(dataSource.map((d) => d[labelField]))
      .range([0, option.width])
      .padding(0.1);

  const y = d3.scaleLinear()
      .domain([0, d3.max(cumulativeData, (d) =>
          d.cumulative > 0 ? d.cumulative : d.start)])
      .nice()
      .range([option.height, 0]);

  // Add X axis
  svg.append('g')
      .attr('transform', `translate(0,${option.height})`)
      .call(d3.axisBottom(x));

  // Add Y axis
  svg.append('g')
      .call(d3.axisLeft(y));

  // Create the waterfall plot
  svg.selectAll('.bar')
      .data(cumulativeData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d[labelField]))
      .attr('y', (d) =>
        d[labelField] === 'End' ? y(d.start) : y(Math.max(0, d.cumulative)))
      .attr('height', (d) =>
        d[labelField] === 'End' ?
        Math.abs(y(d.start) - y(0)) :
        Math.abs(y(d.cumulative) - y(d.cumulative - d[valueField])))
      .attr('width', x.bandwidth())
      .attr('fill', (d) =>
        d[labelField] === 'End' ?
      'red' : (d[valueField] >= 0 ? 'steelblue' : 'red'));

  // Add the text labels
  svg.selectAll('.label')
      .data(cumulativeData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d) => x(d[labelField]) + x.bandwidth() / 2)
      .attr('y', (d) =>
        d[labelField] === 'End' ? y(d.start) - 5 : y(d.cumulative) - 5)
      .attr('text-anchor', 'middle')
      .text((d) => d[labelField] === 'End' ? d.start : d.cumulative);
};

init.container = () => {
  if (!D3PainterForWaterFall.self.container) {
    return new Error('The Container attribute can\'t be null');
  }
  const option = D3PainterForWaterFall.self.option;

  const svg = d3.select(D3PainterForWaterFall.self.container)
      .append('svg')
      .attr('width', option.width + option.margin.left + option.margin.right)
      .attr('height', option.height + option.margin.top + option.margin.bottom)
      .append('g')
      .attr('transform',
          `translate(${option.margin.left}, ${option.margin.top})`);
  return svg;
};


export default D3PainterForWaterFall;
