import {getTheme} from 'config/theme';
import {SelectBox} from 'devextreme-react';
import {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {getPalette, registerPalette} from 'devextreme/viz/palette';

const hns = ['#BFBFBF', '#D80028', '#BFBFBF', '#D80028'];
const rainbow = ['#e81416', '#ffa500', '#faeb36', '#79c314',
  '#487de7', '#70369d'];

registerPalette('hns', {
  simpleSet: hns
});

registerPalette('rainbow', {
  simpleSet: rainbow
});

export const paletteCollection = [
  {
    name: 'Material',
    caption: '기본값',
    colors: getPalette('Material').simpleSet
  },
  {
    name: 'Soft Pastel',
    caption: '부드러운 파스텔',
    colors: getPalette('Soft Pastel').simpleSet
  },
  {
    name: 'Harmony Light',
    caption: '조화로운 빛',
    colors: getPalette('Harmony Light').simpleSet
  },
  {
    name: 'Pastel',
    caption: '파스텔',
    colors: getPalette('Pastel').simpleSet
  },
  {
    name: 'Bright',
    caption: '밝은',
    colors: getPalette('Bright').simpleSet
  },
  {
    name: 'Soft',
    caption: '부드러운',
    colors: getPalette('Soft').simpleSet
  },
  {
    name: 'Ocean',
    caption: '바다',
    colors: getPalette('Ocean').simpleSet
  },
  {
    name: 'Office',
    caption: '오피스',
    colors: getPalette('Office').simpleSet
  },
  {
    name: 'Vintage',
    caption: '빈티지',
    colors: getPalette('Vintage').simpleSet
  },
  {
    name: 'Violet',
    caption: '보라색',
    colors: getPalette('Violet').simpleSet
  },
  {
    name: 'Carmine',
    caption: '카민',
    colors: getPalette('Carmine').simpleSet
  },
  {
    name: 'Dark Moon',
    caption: '어두운 달',
    colors: getPalette('Dark Moon').simpleSet
  },
  {
    name: 'Soft Blue',
    caption: '부드러운 파랑',
    colors: getPalette('Soft Blue').simpleSet
  },
  {
    name: 'Dark Violet',
    caption: '어두운 보라',
    colors: getPalette('Dark Violet').simpleSet
  },
  {
    name: 'Green Mist',
    caption: '녹색 안개',
    colors: getPalette('Green Mist').simpleSet
  },
  {
    name: 'rainbow',
    caption: '무지개',
    colors: rainbow
  },
  {
    name: 'hns',
    caption: '홈앤쇼핑',
    colors: hns
  }
];


const paletteLabel = {'aria-label': 'Palette'};

const PaletteItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const PaletteName = styled.div`
  font-size: 1rem;
`;

const PaletteColors = styled.div`
  display: flex;
`;

const PaletteColor = styled.div`
  width: 35px;
  height: 35px;
`;

const renderPaletteItem = (data) => {
  return (
    <PaletteItem>
      <PaletteName>{data.caption}</PaletteName>
      <PaletteColors>
        {data.colors.map((color, index) => (
          index >= 6 ? null :
          <PaletteColor key={index}
            style={{backgroundColor: color}}/>
        ))}
      </PaletteColors>
    </PaletteItem>
  );
};

const theme = getTheme();

const Palette = ({onValueChanged, ...props}) => {
  const [palette, setPalette] = useState(props.palette);
  const selectBoxRef = useRef(null);

  useEffect(() => {
    if (selectBoxRef.current) {
      selectBoxRef.current.instance.option('value', props.palette?.name);
    }
  }, [props.palette]);

  const handlePaletteChange = (e) => {
    const pickPalette =
      paletteCollection.filter((item) => item.name === e.value);
    setPalette(pickPalette[0]);
    if (e?.event?.type === 'dxclick') onValueChanged(e, pickPalette[0]);
  };

  const handleFocusIn = (e) => {
    onValueChanged(e, palette);
  };

  return (
    <SelectBox
      ref={selectBoxRef}
      style={{width: theme.size.width_450}}
      items={paletteCollection}
      inputAttr={paletteLabel}
      displayExpr='caption'
      valueExpr='name'
      defaultValue={palette?.name}
      onValueChanged={handlePaletteChange}
      onFocusIn={handleFocusIn}
      itemRender={renderPaletteItem}
    />
  );
};

export default Palette;
