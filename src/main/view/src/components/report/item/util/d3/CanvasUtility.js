
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
