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
