import {useEffect, useRef} from 'react';
import * as d3 from 'd3';

export const liquidFillGaugeDefaultConfig = () => {
  return {
    minValue: 0,
    maxValue: 100,
    circleThickness: 0.05,
    circleFillGap: 0.05,
    circleColor: '#178BCA',
    waveHeight: 0.05,
    waveCount: 5,
    waveRiseTime: 1000,
    waveAnimateTime: 1000,
    waveRise: true,
    waveHeightScaling: true,
    waveAnimate: true,
    waveColor: '#178BCA',
    waveOffset: 0,
    topVertPosition: .9,
    topTextSize: 0.5,
    bottomVertPosition: .2,
    bottomTextSize: 0.35,
    middleTextVertPosition: .5,
    middleTextSize: 0.9,
    valueCountUp: false,
    displayPercent: true,
    textColor: '#178BCA',
    waveTextColor: 'white'
  };
};

const configInit = (config, {color, width}) => {
  config.width = width;
  config.height = width;
  config.circleColor = color;
  config.waveColor = color;
  config.textColor = color;
};

const D3LiquidFillGauge = ({
  dataSource = null,
  elementId = 'text',
  dimension = 'dimension',
  measure = 'measure',
  width,
  height,
  value = 75,
  color = '#178BCA',
  onClick,
  notationFormat,
  config = liquidFillGaugeDefaultConfig()
}) => {
  const svgRef = useRef();
  // temporary value, under value is percent
  configInit(config, {
    color: color,
    width: width
  });

  useEffect(() => {
    let positionIndex = 0;
    let waveHeightScale;
    const container = svgRef.current;
    container.innerHTML = '';
    const position = ['middle', 'top', 'bottom'];
    const gauge = d3.select(container)
        .append('svg')
        .attr('width', config.width)
        .attr('height', config.height);
    const radius =
      Math.min(
          parseInt(gauge.style('width')), parseInt(gauge.style('height'))
      ) / 2;
    const locationX = parseInt(gauge.style('width')) / 2 - radius;
    const locationY = parseInt(gauge.style('height')) / 2 - radius;
    const fillPercent =
      Math.max(config.minValue,
          Math.min(config.maxValue, value)) / config.maxValue;

    if (config.waveHeightScaling) {
      waveHeightScale = d3.scaleLinear()
          .range([0, config.waveHeight, 0])
          .domain([0, 50, 100]);
    } else {
      waveHeightScale = d3.scaleLinear()
          .range([config.waveHeight, config.waveHeight])
          .domain([0, 100]);
    }

    const textPixels = (config.middleTextSize * radius / 2);
    const topTextPixels = (config.topTextSize * radius / 2);
    const bottomTextPixels = (config.bottomTextSize * radius / 2);
    const textFinalValue = parseFloat(value).toFixed(2);
    const textStartValue =
      config.valueCountUp ? config.minValue : textFinalValue;
    const percentText = config.displayPercent ? '%' : '';

    const circleThickness = config.circleThickness * radius;
    const circleFillGap = config.circleFillGap * radius;
    const fillCircleMargin = circleThickness + circleFillGap;
    const fillCircleRadius = radius - fillCircleMargin;
    const waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

    const waveLength = fillCircleRadius * 2 / config.waveCount;
    const waveClipCount = 1 + config.waveCount;
    const waveClipWidth = waveLength * waveClipCount;
    let textRounder = function(value) {
      return Math.round(value);
    };

    if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
      textRounder = function(value) {
        return parseFloat(value).toFixed(1);
      };
    }

    const data = [];
    for (let i = 0; i<= 40 * waveClipCount; i++) {
      data.push({x: i / (40 * waveClipCount), y: (i / 40)});
    }

    const gaugeCircleX =
      d3.scaleLinear().range([0, 2 * Math.PI]).domain([0, 1]);
    const gaugeCircleY =
      d3.scaleLinear().range([0, radius]).domain([0, radius]);
    const waveScaleX =
      d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
    const waveScaleY =
      d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);
    const waveRiseScale = d3.scaleLinear()
        .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight),
          (fillCircleMargin - waveHeight)])
        .domain([0, 1]);
    const waveAnimateScale = d3.scaleLinear()
        .range([0, waveClipWidth - fillCircleRadius * 2])
        .domain([0, 1]);
    const textRiseScaleY = d3.scaleLinear()
        .range([fillCircleMargin + fillCircleRadius * 2,
          (fillCircleMargin + textPixels * 0.7)])
        .domain([0, 1]);
    const gaugeGroup = gauge.append('g')
        .attr('transform', 'translate('+ locationX +','+ locationY +')');

    const gaugeCircleArc = d3.arc()
        .startAngle(gaugeCircleX(0))
        .endAngle(gaugeCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius-circleThickness));

    gaugeGroup.append('path')
        .attr('d', gaugeCircleArc)
        .style('fill', config.circleColor)
        .attr('transform', 'translate('+ radius +','+ radius +')');

    const textOption = {
      'middle': {
        'textAnchor': 'middle',
        'fontSize': textPixels + 'px',
        'transform': 'translate('+ radius +','+
          textRiseScaleY(config.middleTextVertPosition) +')',
        'topMaxWidth': config.width - (config.width / 5)
      },
      'top': {
        'textAnchor': 'middle',
        'fontSize': topTextPixels + 'px',
        'transform': 'translate('+ radius +','+
          textRiseScaleY(config.topVertPosition) +')',
        'topMaxWidth': config.width - (config.width / 2)
      },
      'bottom': {
        'textAnchor': 'middle',
        'fontSize': bottomTextPixels + 'px',
        'transform': 'translate('+ radius +','+
          textRiseScaleY(config.bottomVertPosition) +')',
        'topMaxWidth': config.width - (config.width / 2)
      }
    };
    const fillCircleGroupText = (type, text) => {
      text = String(text);
      const textNode = fillCircleGroup.append('text')
          .text(text)
          .attr('class', 'liquidFillGaugeText')
          .attr('text-anchor', textOption[type].textAnchor)
          .attr('font-size', textOption[type].fontSize)
          .style('fill', config.waveTextColor)
          .attr('transform', textOption[type].transform);

      const textWidth = textNode.node().getComputedTextLength();
      const maxLength = textOption[type].topMaxWidth;
      if (textWidth > maxLength) {
        const shortenedText =
        text.slice(0, Math.floor(maxLength / textWidth * text.length)) + '...';
        textNode.text(shortenedText);
      }

      return textNode;
    };
    const gaugeGroupText = (type, text) => {
      text = String(text);
      const textNode = gaugeGroup.append('text')
          .text(text)
          .attr('class', 'liquidFillGaugeText')
          .attr('text-anchor', textOption[type].textAnchor)
          .attr('font-size', textOption[type].fontSize)
          .style('fill', config.textColor)
          .attr('transform', textOption[type].transform);

      const textWidth = textNode.node().getComputedTextLength();
      const maxLength = textOption[type].topMaxWidth;
      if (textWidth > maxLength) {
        const shortenedText =
        text.slice(0, Math.floor(maxLength / textWidth * text.length)) + '...';
        textNode.text(shortenedText);
      }

      return textNode;
    };
    // percent > dimension > measure
    notationFormat.percent ?
    gaugeGroupText(
        position[positionIndex++],
        textRounder(textStartValue) + percentText
    ) : '';

    notationFormat.argument ?
    gaugeGroupText(
        position[positionIndex++],
        dimension
    ) : '';

    notationFormat.value ?
    gaugeGroupText(
        position[positionIndex++],
        measure
    ) : '';

    positionIndex = 0;

    const clipArea = d3.area()
        .x(function(d) {
          return waveScaleX(d.x);
        })
        .y0(function(d) {
          return waveScaleY(
              Math.sin(
                  Math.PI * 2 * config.waveOffset * - 1 +
                  Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI
              ));
        })
        .y1(function(d) {
          return (fillCircleRadius * 2 + waveHeight);
        });

    const waveGroup = gaugeGroup.append('defs')
        .append('clipPath')
        .attr('id', 'clipWave' + elementId);

    const wave = waveGroup.append('path')
        .datum(data)
        .attr('d', clipArea)
        .attr('T', 0);

    const fillCircleGroup = gaugeGroup.append('g')
        .attr('clip-path', 'url(#clipWave' + elementId + ')');

    fillCircleGroup.append('circle')
        .attr('cx', radius)
        .attr('cy', radius)
        .attr('r', fillCircleRadius)
        .style('fill', config.waveColor);

    notationFormat.percent ?
    fillCircleGroupText(
        position[positionIndex++],
        textRounder(textStartValue) + percentText
    ) : '';

    notationFormat.argument ?
    fillCircleGroupText(
        position[positionIndex++],
        dimension
    ) : '';

    notationFormat.value ?
    fillCircleGroupText(
        position[positionIndex++],
        measure
    ) : '';

    const waveGroupXPosition =
      fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
    if (config.waveRise) {
      waveGroup.attr('transform', 'translate('+
        waveGroupXPosition+','+ waveRiseScale(0) +')')
          .transition()
          .duration(config.waveRiseTime)
          .attr('transform', 'translate('+
            waveGroupXPosition +','+ waveRiseScale(fillPercent) +')')
          .on('start', function() {
            wave.attr('transform', 'translate(1,0)');
          });
    } else {
      waveGroup.attr('transform', 'translate('+
        waveGroupXPosition+','+ waveRiseScale(fillPercent) +')');
    }

    const animateWave = function() {
      wave.attr('transform', 'translate('+
        waveAnimateScale(wave.attr('T'))+',0)');
      wave.transition()
          .duration(config.waveAnimateTime * (1 - wave.attr('T')))
          .ease(d3.easeLinear)
          .attr('transform', 'translate('+ waveAnimateScale(1) + ',0)')
          .on('end', function() {
            wave.attr('T', 0);
            animateWave();
          });
    };
    if (config.waveAnimate) {
      animateWave();
    };
  }, [config]);

  return (
    <div ref={svgRef}
      onClick={(e) => {
        e.ref = svgRef;
        return onClick(e, {
          dimension: dimension,
          measure: measure
        });
      }}
    />
  );
};

export default D3LiquidFillGauge;
