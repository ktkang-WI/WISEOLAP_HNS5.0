import {styled, css} from 'styled-components';
import React, {useState} from 'react';
import {getTheme} from '../../../config/theme';
import {hexToRgb, rgbToFilterString} from 'components/utils/Color';
import AnimatedButtonLabel from '../atoms/AnimatedButtonLabel';

const theme = getTheme();

const Button = styled.div`
  width: ${(props) => props.width || '60px'};
  height: ${(props) => props.height || '60px'};
  color: ${theme.color.primaryFont};
  cursor: pointer;

  &:active > img{
    transform: scale(0.9, 0.9);
    transition: transform .2s;
  }

  &:hover{
    color: ${theme.color.primary};
  }
  
  ${(props) => props.hoveranimation && css`
    &:hover, &:active{
      ${rgbToFilterString(hexToRgb(theme.color.primary))}
    }
  `}
`;

const Image = styled.img`
  width: auto;
  height: ${(props) => props.height};
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
  onClick, imgSrc, label, hoveredImgSrc, width='80px', height='50px', ...props
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
      hoveranimation={hoveredImgSrc? '' : 'true'}
      onClick={onClick}
      onMouseOver={hoveredImgSrc? onMouseOver : null}
      onMouseOut={hoveredImgSrc? onMouseOut : null}
      {...props}
    >
      <Image
        src={src}
        height={height}
      />
      <AnimatedButtonLabel>
        {label}
      </AnimatedButtonLabel>
    </Button>
  );
};

export default React.memo(AnimatedButton);
