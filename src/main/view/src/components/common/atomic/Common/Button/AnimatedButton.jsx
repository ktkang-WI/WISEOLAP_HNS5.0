import {styled, css} from 'styled-components';
import React, {useState} from 'react';
import {getTheme} from '../../../../../config/theme';
import AnimatedButtonLabel from '../Label/AnimatedButtonLabel';

const theme = getTheme();

const Button = styled.div`
  width: calc(${(props) => props.width || '60px'} - 10px);
  margin: 12px 10px;
  height: 76px;
  color: ${theme.color.gray600};
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  border-radius: 16px 6px;
  ${(props) => props.direction == 'row' ? css `
    flex-direction: row;
    width: ${theme.size.snbDrawerWidth};
  ` : css `
    flex-direction: column;
  `}

  cursor: pointer;

  &:active > img{
    transform: scale(0.9, 0.9);
    transition: transform .2s;
  }

  &.selected, &:hover {
    background: linear-gradient(180deg, #005EAD 0%, #0082F0 145.39%);
    color: ${theme.color.white};
  }
  
  &.selected img {
    filter: brightness(0) invert(1);
  }
  
  ${(props) => props.hoveranimation && css`
    &:hover img, &:active img{
      -webkit-filter: brightness(0) invert(1); 
      filter: brightness(0) invert(1);
    }
  `}
`;

const Image = styled.img`
  width: auto;
  height: ${(props) => props.height};
  margin: ${(props) => props.margin};
`;

/**
 * @component
 * hoveredImgSrc 없는 경우 primary 색상으로 hover 애니메이션 삽입
 * 모든 파라미터는 미입력시 기본값으로 적용됩니다.
 * onClick: 클릭 이벤트
 * imgSrc: 버튼 이미지
 * label: 라벨
 * hoveredImgSrc: 마우스 오버시 변할 이미지
 * width: 컴포넌트 넓이(기본값 60px)
 * height: 컴포넌트 높이(기본값 60px)
 * @param {any} props
 * @return {Component}
 */
const AnimatedButton = ({
  onClick,
  imgSrc,
  label,
  hoveredImgSrc,
  width='80px',
  height='40px',
  direction='column',
  active = false,
  ...props
}) => {
  const [src, setSrc] = useState(imgSrc);

  const onMouseOver = function() {
    setSrc(hoveredImgSrc);
  };

  const onMouseOut = function() {
    setSrc(imgSrc);
  };

  return (
    <Button
      width={width}
      height={height}
      direction={direction}
      onClick={onClick}
      onMouseOver={hoveredImgSrc? onMouseOver : null}
      onMouseOut={hoveredImgSrc? onMouseOut : null}
      className={active? 'selected' : ''}
      {...props}
    >
      <Image
        src={src}
        height={height && direction === 'row' ?
          'calc(' + height + ' - 8px)': height}
        margin={direction === 'row' ? '4px' : '0px'}
      />
      <AnimatedButtonLabel textAlign={direction == 'column'? 'center' : 'left'}>
        {label}
      </AnimatedButtonLabel>
    </Button>
  );
};

export default React.memo(AnimatedButton);
