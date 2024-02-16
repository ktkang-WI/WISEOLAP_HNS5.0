import {getTheme} from 'config/theme';
import {SelectBox} from 'devextreme-react';
import {useState} from 'react';
import styled from 'styled-components';

export const paletteCollection = [
  {
    name: 'Material',
    caption: '기본값',
    colors: ['#6200EE', '#3700B3', '#03DAC6', '#FF3D00', '#795548', '#00CED1']
  },
  {
    name: 'Soft Pastel',
    caption: '부드러운 파스텔',
    colors: ['#FFD700', '#FF69B4', '#87CEEB', '#ADFF2F', '#FFA07A', '#FF6347']
  },
  {
    name: 'Harmony Light',
    caption: '조화로운 빛',
    colors: ['#E0FFFF', '#FFE4E1', '#FFEBCD', '#F0F8FF', '#F5DEB3', '#32CD32']
  },
  {
    name: 'Pastel',
    caption: '파스텔',
    colors: ['#87CEEB', '#90EE90', '#FFB6C1', '#FFD700', '#FFA07A', '#6495ED']
  },
  {
    name: 'Bright',
    caption: '밝은',
    colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#4169E1']
  },
  {
    name: 'Soft',
    caption: '부드러운',
    colors: ['#ADD8E6', '#90EE90', '#D3D3D3', '#FFB6C1', '#FFA07A', '#20B2AA']
  },
  {
    name: 'Ocean',
    caption: '바다',
    colors: ['#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#4682B4']
  },
  {
    name: 'Office',
    caption: '오피스',
    colors: ['#1E90FF', '#228B22', '#FF69B4', '#FFD700', '#808080', '#BC8F8F']
  },
  {
    name: 'Vintage',
    caption: '빈티지',
    colors: ['#CD5C5C', '#F08080', '#FA8072', '#B22222', '#A52A2A', '#800000']
  },
  {
    name: 'Violet',
    caption: '보라색',
    colors: ['#8A2BE2', '#9932CC', '#9400D3', '#DA70D6', '#BA55D3', '#800080']
  },
  {
    name: 'Carmine',
    caption: '카민',
    colors: ['#960018', '#D70040', '#E2062C', '#FFAFB9', '#DE3163', '#DC143C']
  },
  {
    name: 'Dark Moon',
    caption: '어두운 달',
    colors: ['#6A5ACD', '#483D8B', '#4B0082', '#8A2BE2', '#9400D3', '#9370DB']
  },
  {
    name: 'Soft Blue',
    caption: '부드러운 파랑',
    colors: ['#4682B4', '#87CEEB', '#ADD8E6', '#B0E0E6', '#87CEFA', '#6495ED']
  },
  {
    name: 'Dark Violet',
    caption: '어두운 보라',
    colors: ['#9400D3', '#8A2BE2', '#800080', '#9932CC', '#4B0082', '#6A5ACD']
  },
  {
    name: 'Green Mist',
    caption: '녹색 안개',
    colors: ['#00FF00', '#7FFF00', '#32CD32', '#98FB98', '#90EE90', '#2E8B57']
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
  width: 50px;
  height: 50px;
`;

const renderPaletteItem = (data) => {
  return (
    <PaletteItem>
      <PaletteName>{data.caption}</PaletteName>
      <PaletteColors>
        {data.colors.map((color, index) => (
          <PaletteColor key={index}
            style={{backgroundColor: color}}/>
        ))}
      </PaletteColors>
    </PaletteItem>
  );
};

const theme = getTheme();

const Palette = ({onValueChanged}) => {
  const [palette, setPalette] = useState(paletteCollection[0]);

  const handlePaletteChange =
      (e) => {
        setPalette(e.value);
        onValueChanged(e);
      };

  return (
    <SelectBox
      style={{width: theme.size.width_450}}
      items={paletteCollection}
      inputAttr={paletteLabel}
      displayExpr='caption'
      valueExpr='name'
      defaultValue={palette.name}
      onValueChanged={handlePaletteChange}
      itemRender={renderPaletteItem}
    />
  );
};

export default Palette;
