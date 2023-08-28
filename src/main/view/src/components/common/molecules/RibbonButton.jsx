import {styled} from 'styled-components';
import React, {useState} from 'react';
import {getTheme} from '../../../config/theme';
import RibbonButtonLabel from '../atoms/RibbonButtonLabel';
import arrowDown from '../../../assets/image/icon/button/arrow_down.png';

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

  &:active > img{
    transform: scale(0.9, 0.9);
    transition: transform .2s;
  }

  &:hover{
    border: 1px solid #c5ccdd;
    background: #f5f6fa;
    border-radius: 10%;
  }
`;

const Image = styled.img`
  height: 24px;
  width: auto;
`;

const ButtonPanel = styled.div`
  width: auto;
  height: 44px;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  cursor: pointer;
  padding: 2px;

  &:active > img{
    transform: scale(0.9, 0.9);
    transition: transform .2s;
  }

  &:hover{
    border: 1px solid #c5ccdd;
    background: #f5f6fa;
    border-radius: 10%;
  }
`;

const ArrowButton = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  color: ${theme.color.primaryFont};
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  padding: 2px;

  &:active > img{
    transform: scale(0.9, 0.9);
    transition: transform .2s;
  }

  &:hover{
    border: 1px solid #c5ccdd;
    background: #f5f6fa;
    border-radius: 10%;
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
  ...props
}) => {
  const [src, setSrc] = useState(imgSrc);
  const onMouseOver = function() {
    setSrc(hoveredImgSrc);
  };

  const onMouseOut = function() {
    setSrc(imgSrc);
  };
  const renderButtonContent = () => {
    if ([
      'save_report',
      'download_report',
      'add_default_chart',
      'add_custom_chart'].includes(buttonKeyId)) {
      // Return a different UI for specific buttons
      return (
        <ButtonPanel>
          <ArrowButton
            width={width}
            height={height}
            hoveranimation={hoveredImgSrc? '' : 'true'}
            onClick={onClick}
            onMouseOver={hoveredImgSrc? onMouseOver : null}
            onMouseOut={hoveredImgSrc? onMouseOut : null}
            {...props}
          >
            <Image src={src} height={height} />
            <RibbonButtonLabel>{label}</RibbonButtonLabel>
          </ArrowButton>
          <ArrowButton
            width={width}
            height={height}
            hoveranimation={hoveredImgSrc? '' : 'true'}
            onClick={onClick}
            onMouseOver={hoveredImgSrc? onMouseOver : null}
            onMouseOut={hoveredImgSrc? onMouseOut : null}
            {...props}
          >
            <ArrowImage src={arrowDown} height={height} />
          </ArrowButton>
        </ButtonPanel>
      );
    } else {
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
          <Image src={src} height={height} />
          <RibbonButtonLabel>{label}</RibbonButtonLabel>
        </Button>
      );
    }
  };

  return (
    renderButtonContent()
  );
};

export default React.memo(RibbonButton);
