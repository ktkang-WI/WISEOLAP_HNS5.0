import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import AnimatedButton from '../molecules/AnimatedButton';
import SNBDefaultElement from './SNBDefaultElement';

const theme = getTheme();

const Wrapper = styled.div`
  padding-top: 50px;
`;

const ItemWrapper = styled.div`
  width: 100%;
  height: 90px;
`;

const getSNBItem = (item) => {
  return (
    <ItemWrapper key={item.id}>
      <AnimatedButton
        label={item.label}
        imgSrc={item.imgSrc}
        title={item.label}
        height={item.height}
        hoveredImgSrc={item.hoveredImgSrc}
      />
    </ItemWrapper>

  );
};

const itemIterator = (items) => {
  if (!items) return;

  return items.map((item) => {
    return getSNBItem(SNBDefaultElement[item]);
  });
};

const StyledSNB = styled.div`
  width: ${theme.size.snbWidth};
  height: calc(100vh - ${theme.size.headerHeight});
  border-right: solid 1px ${theme.color.breakLine};
  box-sizing: border-box;
  background: ${theme.color.panelColor};
  position: absolute;
  left: 0px;
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
