import {styled, css} from 'styled-components';
import {getTheme} from 'config/theme';
import {getConfig} from 'config/config';
import AnimatedButton from '../molecules/AnimatedButton';
import snbDefaultElement from './SNBDefaultElement';

const theme = getTheme();
const useSNBDrawer = getConfig('useSNBDrawer');
const snbOnlyIcon = getConfig('snbOnlyIcon');

const Wrapper = styled.div`
  ${snbOnlyIcon? css`
    display: flex;
    justify-content: center;
    height: calc(100% - ${theme.size.headerHeight});
    flex-direction: column;
  `: useSNBDrawer? css`
    padding-top: 10px;
  `:
  css`
    padding-top: 50px;
  `}
`;

const ItemWrapper = styled.div`
  width: 100%;
  height: ${(props) => props.height ?
  'calc(' + props.height + ' + 5px)' : '90px'};
`;

const getSNBItem = (item) => {
  if (snbOnlyIcon || useSNBDrawer) {
    return (
      <ItemWrapper key={item.id} height={theme.size.snbWidth}>
        <AnimatedButton
          label={item.label}
          imgSrc={item.imgSrc}
          title={item.label}
          height={theme.size.snbWidth}
          direction={'row'}
          hoveredImgSrc={item.hoveredImgSrc}
          onClick={item.onClick}
          path={item.path}
        />
      </ItemWrapper>
    );
  } else {
    return (
      <ItemWrapper key={item.id}>
        <AnimatedButton
          label={item.label}
          imgSrc={item.imgSrc}
          title={item.label}
          height={item.height}
          width={theme.size.snbWidth}
          hoveredImgSrc={item.hoveredImgSrc}
          onClick={item.onClick}
          path={item.path}
        />
      </ItemWrapper>
    );
  }
};

const itemIterator = (items) => {
  if (!items) return;

  return items.map((item) => {
    return getSNBItem(snbDefaultElement()[item]);
  });
};

const StyledSNB = styled.div`
  width: ${theme.size.snbWidth};
  height: calc(100vh - ${theme.size.headerHeight});
  border-right: solid 1px ${theme.color.breakLine};
  box-sizing: border-box;
  background: ${theme.color.panelColor};
  overflow: hidden;
  position: absolute;
  left: 0px;
  z-index: 0;
  transition: width 0.5s, z-index 0.5s step-end;

  ${useSNBDrawer && css`
    &:hover {
      width: ${theme.size.snbDrawerWidth};
      z-index: 30;
      transition: width 0.5s, z-index 0.5s;
      & > div > div {
        box-sizing: border-box;
        border-bottom: 1px solid ${theme.color.breakLine};
      }
    }
  `}
`;

const SideNavigationBar = ({content}) => {
  return (
    <StyledSNB>
      <Wrapper>
        {itemIterator(content)}
      </Wrapper>
    </StyledSNB>
  );
};

export default SideNavigationBar;
