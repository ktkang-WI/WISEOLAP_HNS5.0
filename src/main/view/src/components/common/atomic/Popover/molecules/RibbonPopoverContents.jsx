import styled from 'styled-components';
import {
  PopoverLabelImageBtn,
  PopoverSubMenu,
  PopoverTextBtn
} from '../atom/InnerContent';
import InnerContentWrapper from '../atom/InnerContentWrapper';
import PopoverTitlePanel from '../atom/PopoverTitlePanel';
import IconWrap from '../atom/IconWrapper';
import {getTheme} from 'config/theme';
import {ImgCheckBox} from
  '../../DataColumnTab/molecules/DataColumnSeriesOptions/Common/ImgCheckBox';

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

const RibbonPopoverContents = ({popoverType, titlePanel, id, element}) => {
  if (id == 'add_default_chart' || id == 'add_custom_chart') {
    const {data, onClick} = element;

    return (
      <div style={{width: '500px', padding: '15px', paddingTop: '5px'}}>
        {data.map((item, index) =>
          <ImgCheckBox key={index}
            onValueChanged={(e) => onClick(e.target.id)}
            title={item.title}
            useChecked={false}
            checkboxs={item.checkboxs} />)}
      </div>
    );
  } else {
    const contents = popoverContents(element, popoverType, titlePanel);

    return contents;
  }
};
export default RibbonPopoverContents;
