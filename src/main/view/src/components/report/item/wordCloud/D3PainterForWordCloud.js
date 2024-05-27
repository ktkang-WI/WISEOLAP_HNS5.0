import * as d3 from 'd3';
import d3Cloud from 'd3-cloud';

// public
const D3PainterForWordCloud = {};

D3PainterForWordCloud.defaultOption = (option) => {
  return {
    size: (group) => group.length,
    word: (d) => d,
    sectionSize: option?.sectionSize ? option?.sectionSize : 5,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    width: option?.width ? option?.width - 50 : 0,
    height: option?.height ? option?.height - 50 : 0,
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
  option,
  defaultOption = D3PainterForWordCloud.defaultOption(option)
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

init.funcs = {};
init.paint = {};

init.funcs.divide = (size) => {
  const sizes = Array.from({length: 8}, (_, i) => 5 * (2 ** i));
  return sizes.find((s) => size < s) || 400;
};

init.funcs.fontSize = (option) => {
  const size = Math.sqrt(
      option.width * option.width + option.height * option.height);
  const average = size / init.funcs.divide(option.length);
  const section = average / option.sectionSize;
  const start = average - (section * 4) || 2;
  return Array.from({length: option.sectionSize}).reduce((acc, _, i) => {
    acc.push(start * (i + 1));
    return acc;
  }, []);
};

init.funcs.measureSection = (dataSource) => {
  const option = D3PainterForWordCloud.self.option;
  const [min, max] = d3.extent(dataSource.map((d) => d.measure));
  const average = max - min;
  const section = average / option.sectionSize;
  return Array.from({length: option.sectionSize}).reduce((acc, _, i) => {
    acc.push(min + (section * (i)));
    return acc;
  }, []);
};

init.funcs.measureIndex = (sections, value) => {
  const index = sections.findIndex((section) => value < section);
  return index === -1 ? sections.length - 1 : index - 1;
};

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
            .text(text.replaceAll('<br/>', '-'))
            .append('title').text(text.replaceAll('<br/>', '-') + ': ' + freq);
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
  const sections = init.funcs.measureSection(dataSource);
  const fontSize = init.funcs.fontSize({
    ...option,
    length: dataSource.length
  });
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
          size: fontSize[init.funcs.measureIndex(sections, size)],
          freq: option.word(freq)}));
};

export default D3PainterForWordCloud;
