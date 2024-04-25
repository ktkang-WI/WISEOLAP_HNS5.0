import * as d3 from 'd3';
import d3Cloud from 'd3-cloud';

// public
const D3PainterForWordCloud = {};

D3PainterForWordCloud.defaultOption = () => {
  return {
    size: (group) => group.length,
    word: (d) => d,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    width: 1680,
    height: 880,
    maxWords: 250,
    fontFamily: 'sans-serif',
    fontScale: 15,
    padding: 0,
    rotate: 0,
    invalidation: null
  };
};

D3PainterForWordCloud.init = ({
  container,
  dataSource,
  defaultOption = D3PainterForWordCloud.defaultOption()
}) => {
  if (!container) return new Error('The Container attribute can\'t be null');
  D3PainterForWordCloud.self = {};
  D3PainterForWordCloud.self.container = container;
  D3PainterForWordCloud.self.option = defaultOption;
  D3PainterForWordCloud.self.data = init.data(dataSource);
  D3PainterForWordCloud.self.isLoaded = true;
};

D3PainterForWordCloud.painting = () => {
  if (!D3PainterForWordCloud.self.isLoaded) {
    return new Error('D3Init is not loaded!');
  }
  const svg = init.container();
  init.paint.drawing(svg);
};

D3PainterForWordCloud.erasing = () => {
  D3PainterForWordCloud.self.container.innerHTML = '';
};

// private
const init = {};
init.paint = {};
init.paint.randomColor = () => {
  return 'hsla(' + ~~(360 * Math.random()) + ',' + '60%,'+ '60%,1)';
};
init.paint.drawing = (svg) => {
  const option = D3PainterForWordCloud.self.option;
  const g = svg.append('g').
      attr('transform', `translate(${option.marginLeft},${option.marginTop})`);
  const cloud = d3Cloud()
      .size(
          [option.width - option.marginLeft -
          option.marginRight, option.height -
          option.marginTop - option.marginBottom])
      .words(D3PainterForWordCloud.self.data)
      .padding(option.padding)
      .rotate(option.rotate)
      .font(option.fontFamily)
      .fontSize((d) => Math.sqrt(d.size) * option.fontScale)
      .on('word', ({size, x, y, rotate, text, freq}) => {
        g.append('text')
            .attr('font-size', size)
            .attr('transform', `translate(${x},${y}) rotate(${rotate})`)
            .attr('opacity', 1.0)
            .attr('fill', init.paint.randomColor())
            .text(text)
            .on('mouseover', function(e) {
              // d3.select(e).attr('opacity', 0.6);
            })
            .on('mouseout', function() {
              // d3.select(e).attr('opacity', 1.0);
            })
            .append('title').text('Frequency: ' + freq);
      });

  cloud.start();
};

init.container = () => {
  if (!D3PainterForWordCloud.self.container) {
    return new Error('The Container attribute can\'t be null');
  }
  const option = D3PainterForWordCloud.self.option;
  return d3.select(D3PainterForWordCloud.self.container)
      .append('svg')
      .attr('width', option.width)
      .attr('height', option.height)
      .attr('font-family', option.fontFamily)
      .attr('text-anchor', 'middle')
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');
};

init.data = (dataSource) => {
  const option = D3PainterForWordCloud.self.option;
  return dataSource
      .map((d) => {
        return [
          d.dimension,
          d.measure,
          d.measure
        ];
      })
      .slice(0, option.maxWords)
      .map(([key, size, freq]) =>
        ({text: option.word(key),
          size: (size / 300),
          freq: option.word(freq)}));
};

export default D3PainterForWordCloud;
