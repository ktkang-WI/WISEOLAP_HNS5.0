import {styled, css} from 'styled-components';
import {getTheme} from 'config/theme';
import {getConfig} from 'config/config';
import AnimatedButton from '../../Common/Button/AnimatedButton';
import snbDefaultElement from './SNBDefaultElement';
import {Popover, ScrollView} from 'devextreme-react';

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
    // padding-top: 50px;
  `}
`;

const ItemWrapper = styled.div`
  width: 100%;
  height: auto;
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
          active={item.active}
          id={item.id}
        />
        {item.isPopover &&
        popOverIterator(item)}
      </ItemWrapper>
    );
  }
};

const popOverIterator = (item) => {
  return (
    <Popover
      target={item.target}
      showEvent={item.showEvent}
      position={item.position}
    >
      {item.content}
    </Popover>
  );
};

const itemIterator = (snbDefaultItems, items) => {
  if (!items) return;

  return items.map((item) => {
    return getSNBItem(snbDefaultItems[item]);
  });
};

const StyledSNB = styled.div`
  width: ${theme.size.snbWidth};
  height: calc(100vh - ${theme.size.headerHeight});
  box-sizing: border-box;
  overflow: hidden;
  position: absolute;
  left: 0px;
  z-index: 0;
  transition: width 0.5s, z-index 0.5s step-end;

  ${useSNBDrawer && css`
    &:hover {
      width: ${theme.size.snbDrawerWidth};
      box-shadow: 2px 1px 5px 0px rgb(187 187 187 / 23%);
      z-index: 30;
      transition: width 0.5s, z-index 0.5s;
      & > div > div {
        box-sizing: border-box;
        & :hover {
          transition: background-color 0.1s;
          background-color: #efefef;
        }
        /* border-bottom: 1px solid ${theme.color.breakLine}; */
      }
    }
  `}
`;

const SideNavigationBar = ({content}) => {
  const snbDefaultItems = snbDefaultElement();
  return (
    <StyledSNB>
      <ScrollView
        height={'100%'}
        width={'100%'}
        direction='vertical'
        showScrollbar={'never'}
      >
        <Wrapper>
          {itemIterator(snbDefaultItems, content)}
        </Wrapper>
      </ScrollView>
    </StyledSNB>
  );
};

export default SideNavigationBar;
