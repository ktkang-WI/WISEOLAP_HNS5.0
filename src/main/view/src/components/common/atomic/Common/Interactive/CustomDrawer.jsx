import Drawer from 'devextreme-react/drawer';
import Wrapper from '../Wrap/Wrapper';
import {useEffect, useRef, useState} from 'react';
import {styled, css} from 'styled-components';
import expandImg from 'assets/image/component/handle.png';
import expandHoverImg from 'assets/image/component/handle_hover.png';
import {getTheme} from 'config/theme';
import {designerRef}
  from 'components/report/atomic/spreadBoard/util/SpreadCore';

const theme = getTheme();

const ExpandButton = styled.div`
  width: 30px;
  height: 30px;
  position: relative;
  bottom: calc(50% - 15px);
  ${(props) => props.expanded ?
  css`left: calc(${theme.size.panelWidth} - 15px);` :
  'left: 5px;'}
  z-index: 10;
  border-radius: 15px;
  box-sizing: border-box;
  display: ${(props) => props.visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  transition: left ease 0.42s;
`;

const ExpandPanel = styled.div`
  width: 20px;
  height: calc(100% -  ${(props) => props.index == 0 ? '2px' : '0px'});
  display: inline-block;
  float: left;
  background: ${theme.color.white};
  border: 1px solid ${theme.color.breakLine};
  ${(props) => props.index == 0 ?
    css`
      border-right: none;
      border-radius: 10px 0px 0px 10px;
    ` :
    css`
      border-radius: 0px 10px 10px 0px;
    `}
`;

const CustomDrawer = ({
  opened=true, useExpandButton=true, children, index=0,
  defaultValue=true, visible=true, margin, ...props
}) => {
  const duration = 400;
  const ref = useRef(null);

  const [expanded, setExpanded] = useState(true);

  const expandDrawer = () => {
    setExpanded(!expanded);
  };

  const ExpandImage = styled.div`
    width: 30px;
    height: 30px;
    transform: rotate(${!expanded ? '0deg' : '180deg'});
    transition: background ease 0.3s;
    background: url(${expandImg}) no-repeat;

    &:hover {
      background: url(${expandHoverImg}) no-repeat;
    }
  `;

  // SpreadContent의 width 조절을 위한 코드 bjsong
  useEffect(() => {
    const designerCompRef = designerRef;
    const refreshSpreadBoard = () => {
      if (designerCompRef?.current) {
        designerCompRef.current.designer.refresh();
      }
    };

    document.getElementsByClassName('dx-drawer-content')[0].style.width =
      `calc(100% - ${theme.size.panelWidth})`;
    refreshSpreadBoard();
    ref.current.instance.content()
        .addEventListener('transitionend', refreshSpreadBoard);
  }, []);


  return (
    <Wrapper margin={margin} className='section'>
      {useExpandButton && !expanded &&
        <ExpandPanel index={index}/>
      }
      <Drawer
        ref={ref}
        opened={expanded && opened && visible}
        position='left'
        openedStateMode='shrink'
        revealMode={'slide'}
        duration={duration}
        // NOTE: 뷰어에서 사용시 보고서 전환시 부자연스러움.
        // 애니메이션 해제
        animationEnabled={useExpandButton}
        {...props}
      >
        {children}
      </Drawer>
      <ExpandButton
        expanded={expanded}
        visible={useExpandButton}
        onClick={expandDrawer}
        bottom={index * 25}
      >
        <ExpandImage></ExpandImage>
      </ExpandButton>
    </Wrapper>
  );
};

export default CustomDrawer;
