import {styled, css} from 'styled-components';
import React, {useState} from 'react';
import {getTheme} from 'config/theme';
import filterImg from 'assets/image/icon/report/filter.png';
import fullscreenImg from 'assets/image/icon/button/fullscreen.png';
import smallscreenImg from 'assets/image/icon/button/smallscreen.png';
import expandImg from 'assets/image/icon/button/expand.png';
import FilterBarWrapper from '../molecules/FilterBarWrapper';
import ribbonDefaultElement from '../../Ribbon/organism/RibbonDefaultElement';
import CommonButton from '../../Common/Button/CommonButton';
import useReportSave from 'hooks/useReportSave';
import SmallImageButton from '../../Common/Button/SmallImageButton';
import FilterBarBtn from '../atom/FilterBarBtn';
import {isPortal} from 'components/utils/PortalUtility';

const theme = getTheme();

const Img = styled.img`
  width: ${(props) => props.width || '16px'};
  height: auto;
  ${(props) => props.rotate && css`
      transform: rotate(180deg);
  `}
`;

const Icon = styled.img`
  width: 20px;
  height: auto;
`;

const ButtonWrapper = styled.div`
  width: calc(${theme.size.panelWidth} + 20px);
  min-width: calc(${theme.size.panelWidth} + 20px);
  height: 100%;
  display: flex;
  justify-content: left;
  align-items: center;

  &::before {
    content: '';
    width: 1px;
    display: block;
    background: ${theme.color.breakLine};
    height: calc(100% - 10px);
    position: relative;
    left: ${theme.size.panelWidth};
  }
`;


const FilterBar = ({
  buttons,
  useExpandButton=true,
  useSearchButton=false,
  useFullscreenButton=false,
  fullscreen = false,
  visible = true,
  handleFullscreen = () => {}
}) => {
  const [isExpand, setIsExpand] = useState(useExpandButton);
  const queryButton = ribbonDefaultElement()['QuerySearch'];
  const {querySearch} = useReportSave();

  const foldedFilterBarHeight = isPortal() ?
    '80px' : theme.size.filterBarHeight;

  const Wrapper = styled.div`
    background: ${theme.color.white};
    height: ${isExpand ?
      'auto' : 'calc(' + foldedFilterBarHeight + ' + 2px)'};
    display: flex;
    box-sizing: border-box;
    border: 1px solid ${theme.color.gray200};
    border-radius: 10px;
  `;

  const getButton = (button, key) => {
    if (!button.visible) {
      return <div key={key} style={{minWidth: button.width}}/>;
    }
    if (button.type == 'expand') {
      return <FilterBarBtn isExpand={isExpand}
        key={key}
        width={button.width}
        onClick={button.onClick}>
        <Icon src={button.value ? button.activeIcon : button.icon}/>
        <span>{button.label}</span>
        <Img src={expandImg} width={'6px'} rotate={button.value}/>
      </FilterBarBtn>;
    }
    if (button.type == 'icon') {
      return <SmallImageButton
        src={button.icon}
        onClick={button.onClick}
      />;
    }
  };

  return (
    <Wrapper style={{
      padding: '0px 5px',
      display: visible ? 'flex' : 'none'
    }} className='section wise-filter'>
      {buttons && buttons.filter((button) => button.visible).length > 0 &&
        <ButtonWrapper>
          {
            buttons.map((button, i) => getButton(button, i))
          }
        </ButtonWrapper>
      }
      {useFullscreenButton &&
        <FilterBarBtn
          title={fullscreen ? '작게 보기' : '전체 화면'}
          isExpand={isExpand}
          width={'20px'}
          onClick={handleFullscreen}>
          <Img src={fullscreen ? smallscreenImg : fullscreenImg}/>
        </FilterBarBtn>
      }
      {useExpandButton &&
        <FilterBarBtn isExpand={isExpand}
          title={'필터 펼치기'}
          onClick={() => setIsExpand(!isExpand)}>
          <Img src={filterImg}/>
        </FilterBarBtn>
      }
      <FilterBarWrapper
        isExpand={isExpand}
      />
      {useSearchButton &&
        <FilterBarBtn width={queryButton.width} isExpand={isExpand}>
          <CommonButton
            label={queryButton.label}
            title={queryButton.label}
            width={queryButton.width}
            height={queryButton.height}
            onClick={querySearch}
            type={queryButton.themeType || 'secondary'}
            borderRadius='4px'
            font={theme.font.ribbonButton}
          >
            <img src={queryButton.icon}/>
            {queryButton.label}
          </CommonButton>
        </FilterBarBtn>
      }
    </Wrapper>
  );
};

export default React.memo(FilterBar);
