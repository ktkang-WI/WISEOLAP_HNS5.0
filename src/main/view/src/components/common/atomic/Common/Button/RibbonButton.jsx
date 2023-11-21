import {styled, css} from 'styled-components';
import React, {useRef, useState} from 'react';
import {getTheme} from '../../../../../config/theme';
import RibbonButtonLabel from '../Label/RibbonButtonLabel';
import arrowDown from '../../../../../assets/image/icon/button/arrow_down.png';

const theme = getTheme();

const Button = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  color: ${theme.color.primaryFont};
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  padding: 6px;
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
  

    div {
      border-left: 1px solid ${theme.color.ribbonHoverBorder};
      background: ${theme.color.ribbonHover};
      border-radius: 10%;
    }
  }
`;

const Image = styled.img`
  height: 24px;
  width: auto;
`;

const ArrowButton = styled.div`
  width: 15px;
  height: 100%;
  color: ${theme.color.primaryFont};
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  right: 0;
  box-sizing: border-box;

  &:active > img{
    transform: scale(0.9, 0.9);
    transition: transform .2s;
  }
`;

const ArrowImage = styled.img`
  height: auto; /* Adjust the height as needed */
  width: 12px;
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
  const ref = useRef(null);
  // console.log('btns', ref);
  const [src, setSrc] = useState(imgSrc);
  const onMouseOver = function() {
    setSrc(hoveredImgSrc);
  };
  const onMouseOut = function() {
    setSrc(imgSrc);
  };
  const renderButtonContent = () => {
    return (
      <Button
        width={width}
        height={height}
        hoveranimation={hoveredImgSrc? '' : 'true'}
        onClick={() => onClick(ref)}
        onMouseOver={hoveredImgSrc? onMouseOver : null}
        onMouseOut={hoveredImgSrc? onMouseOut : null}
        {...props}
        rightButton={useArrowButton}
        ref={ref}
      >
        <Image src={src} height={height} />
        <RibbonButtonLabel>{label}</RibbonButtonLabel>
        {useArrowButton && (
          <ArrowButton
            width={width}
            height={height}
            hoveranimation={hoveredImgSrc ? '' : 'true'}
            // onClick={onClick}
            onMouseOver={hoveredImgSrc ? onMouseOver : null}
            onMouseOut={hoveredImgSrc ? onMouseOut : null}
            {...props}
          >
            <ArrowImage src={arrowDown} height={height} />
          </ArrowButton>
        )}
      </Button>
    );
  };

  return (
    renderButtonContent()
  );
};

export default React.memo(RibbonButton);
