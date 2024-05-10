import * as d3 from 'd3';

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

export const getTextWidth = (text, fontSize, fontFamily = 'Noto Sans KR') => {
  context.font = fontSize + 'px ' + fontFamily;
  return context.measureText(text).width;
};

export const getHatchingPattern = () => {
  const pattern = {
    id: 'hatch',
    width: '4',
    height: '10',
    patternTransform: 'rotate(50)',
    patternUnits: 'userSpaceOnUse'
  };

  return (<pattern {...pattern}>
    <rect width="2" height="10" fill="white" opacity="0.4"></rect>
  </pattern>);
};

/**
 * d3에서 블렌디드 팔레트 적용을 위한 배열 반환
 * @param {Array} palette 팔레트
 * @param {Number} length 색상 적용 대상 개수
 * @return {Array}
 */
export const getPaletteForD3 = (palette, length) => {
  // 팔레트 길이가 데이터 길이보다 짧으면 그냥 반환
  if (palette.length >= length) {
    return palette.slice(0, length);
  };

  const interpolate = d3.interpolateRgbBasis(palette);

  const newPalette = [];
  const step = 1 / (length - 1);

  for (let i = 0; i < length; i++) {
    newPalette.push(interpolate(i * step));
  }

  return newPalette;
};

/**
 * 범례를 그리기 위한 옵션을 계산합니다.
 * @param {JSON} legend 범례 옵션
 * @param {number} width 아이템 너비
 * @param {number} height 아이템 높이
 * @param {Array} legendData name으로 구성된 Array
 * @return {JSON} {itemWidth, itemHeight, legendOptions}
 */
export const getLegendOptions = (legend, width, height, legendData) => {
  const MARGIN = 30;
  const textPos = legend.itemTextPosition;

  let itemHeight = height;
  let itemWidth = width;
  let legendWidth = 0;
  let legendHeight = 0;

  // 1. 몇줄로 렌더링될지 구하기
  // textPos가 right인 경우 세로로 그림.
  // textPos가 bottom인 경우 가로로 그림.
  const legendOption = {
    maxWidth: [],
    count: 0,
    row: 0,
    visible: false
  };

  if (!legend?.useLegend || !width || !height) {
    return {itemHeight, itemWidth, legendOption};
  }

  if (textPos == 'bottom') {
    // 마진을 포함한 가장 긴 라벨의 너비
    const maxWidth = legendData.reduce((acc, name) => {
      return Math.max(acc, getTextWidth(name, 12, 'Noto Sans KR'));
    }, 0) + 10;

    // 가로 한 줄에 들어가게 될 범례 수
    const count = Math.max(Math.floor((width - MARGIN) / maxWidth), 1);
    const row = Math.max(Math.ceil(legendData.length / count), 1);

    legendHeight = row * 40;
    legendOption.maxWidth = maxWidth;
    legendOption.count = count;
    legendOption.row = row;
  } else {
    // 세로 한 줄에 들어가게 될 범례 수
    const count = Math.max(Math.floor((height - MARGIN) / 25), 1);
    const row = Math.max(Math.ceil(legendData.length / count), 1);

    const maxWidth = legendData.reduce((acc, name, i) => {
      const idx = Math.floor(i / count);
      acc[idx] = Math.max(acc[idx],
          getTextWidth(name, 12, 'Noto Sans KR') + 30);
      return acc;
    }, Array(row).fill(0));

    legendOption.maxWidth = maxWidth;
    legendOption.count = count;
    legendOption.row = row;

    legendWidth = maxWidth.reduce((acc, num) => acc + num, 0);
  }

  itemHeight = itemHeight - legendHeight;
  itemWidth = itemWidth - legendWidth;

  // 범례가 절반 이상 차지할시 범례 그리지 않음.
  if (itemHeight < legendHeight || itemWidth < legendWidth) {
    itemHeight = height;
    itemWidth = width;
  } else {
    legendOption.visible = true;
  }

  return {
    itemHeight,
    itemWidth,
    legendOption
  };
};
