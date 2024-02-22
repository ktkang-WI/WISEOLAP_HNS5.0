import {styled, css} from 'styled-components';
import React, {useState} from 'react';
import {getTheme} from 'config/theme';
import RibbonButtonLabel from '../Label/RibbonButtonLabel';
import arrowDown from 'assets/image/icon/button/expand_ribbon.png';

const theme = getTheme();

const Button = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  color: ${theme.color.primaryFont};
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  padding: 4px 6px;
  position: relative;
  box-sizing: border-box;
  border-radius: 10%;

  ${(props) => props.rightButton && css`
    padding-right: 20px;
  `}

  &:active > img{
    transform: scale(0.9, 0.9);
    transition: transform .2s;
  }

  &:hover{
    outline: 1px solid ${theme.color.dataColumnBorder};
    background: ${theme.color.ribbonHover};
    box-sizing: border-box;
  }
`;

const Image = styled.img`
  height: 24px;
  width: auto;
`;

const ImageGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const ArrowImage = styled.img`
  height: 6px; /* Adjust the height as needed */
  width: 6px;
  position: absolute;
  right: 0px;
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
const RibbonButton = ({
  onClick,
  imgSrc,
  label,
  buttonKeyId,
  hoveredImgSrc,
  width='60px',
  height='60px',
  useArrowButton,
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
      hoveranimation={hoveredImgSrc? '' : 'true'}
      onClick={onClick}
      onMouseOver={hoveredImgSrc? onMouseOver : null}
      onMouseOut={hoveredImgSrc? onMouseOut : null}
      {...props}
    >
      <ImageGroup>
        <Image src={src} height={height}
          style={{margin: useArrowButton ? '0px 8px' : ''}}/>
        {useArrowButton &&
          <ArrowImage src={arrowDown} height={height} />}
      </ImageGroup>
      <RibbonButtonLabel>{label}</RibbonButtonLabel>
    </Button>
  );
};

export default React.memo(RibbonButton);
