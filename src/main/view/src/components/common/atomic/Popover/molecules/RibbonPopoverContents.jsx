import styled from 'styled-components';
import {
  PopoverLabelImageBtn,
  PopoverSubMenu,
  PopoverTextBtn
} from '../atom/InnerContent';
import InnerContentWrapper from '../atom/InnerContentWrapper';
import PopoverTitlePanel from '../atom/PopoverTitlePanel';
import IconWrap from '../atom/IconWrapper';
import elementFactory from './ElementFactory';
import {getTheme} from 'config/theme';

const theme = getTheme();

const StyledDiv = styled.div`
  height: auto;
  list-style: none;
  color: ${theme.color.gray500};
`;

const TitleWrap = styled.div`
  padding: 15px 15px 5px 5px;
`;

const popoverSelector = (type, items) => {
  if (type === 'labelImages') {
    return (
      <InnerContentWrapper type={type}>
        {items.map((item, idx) => {
          return (
            <IconWrap key={idx}>
              <PopoverLabelImageBtn
                visible={item.visible ? true : false}
                label={item.label}
                imgSrc={item.imgSrc}
                onClick={item.onClick}
              />
            </IconWrap>
          );
        })}
      </InnerContentWrapper>
    );
  } else if (type === 'onlyTextBtn') {
    return (
      <InnerContentWrapper>
        {items.map((item, idx) => {
          return (item.visible || typeof item.visible === 'undefined') &&
            <PopoverTextBtn
              key={idx}
              label={item.label}
              onClick={item.onClick}
            />;
        })}
      </InnerContentWrapper>
    );
  } else if (type === 'subMenuBtn') {
    return (
      <InnerContentWrapper>
        {items.map((item, idx) => {
          return item.visible &&
            <PopoverSubMenu
              label={item.label}
              visible={item.visible}
              contents={item.contents}
              key={idx}
            />;
        })}
      </InnerContentWrapper>
    );
  }
};

const popoverContents = (element, popoverType, titlePanel) => {
  const contents = element['keys'].map((e, idx) => {
    return (
      <StyledDiv key={idx}>
        {titlePanel &&
            <TitleWrap>
              <PopoverTitlePanel>
                {e}
              </PopoverTitlePanel>
            </TitleWrap>}

        {popoverSelector(popoverType, element[e])}
      </StyledDiv>
    );
  });
  return contents;
};

const RibbonPopoverContents = ({popoverType, titlePanel, id, props}) => {
  const element = elementFactory(id);
  const contents = popoverContents(element, popoverType, titlePanel);

  return contents;
};
export default RibbonPopoverContents;
