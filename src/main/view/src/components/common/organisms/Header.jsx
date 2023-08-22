// import React from 'react';
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import HeaderPanel from 'components/common/atoms/HeaderPanel';
import HeaderLogoImage from 'components/common/atoms/HeaderLogoImage';
import AnimatedImageButton from 'components/common/atoms/AnimatedImageButton';
import ReportTitleTabs from './ReportTitleTabs';
import LabelImageButton from '../molecules/LabelImageButton';
import headerDefaultElement from './HeaderDefaultElement';

const theme = getTheme();

const StyledHeader = styled.div`
  width: 100vw;
  height: ${theme.size.headerHeight};
  border-bottom: solid 1px ${theme.color.breakLine};
  background: ${theme.color.panelColor};
  box-sizing: border-box;
  box-shadow: 0 0 11px #eaf0f6;
`;

const Left = styled.div`
  width: 45%;
  height: 100%;
  text-align: left;
  float: left;
`;

const Right = styled.div`
  width: 45%;
  height: 100%;
  text-align: right;
  float: right;
`;

const getHeaderItem = (item) => {
  if (item.type === 'AnimatedImageButton') {
    return (
      <HeaderPanel leftborder="true" key={item.id} position={item.position}>
        <AnimatedImageButton
          title={item.title}
          width={item.width}
          height={item.height}
          imgSrc={item.imgSrc}
          hoveredImgSrc={item.hoveredImgSrc}
          onClick={item.onClick}
        />
      </HeaderPanel>
    );
  } else if (item.type === 'LabelImageButton') {
    return (
      <HeaderPanel key={item.id} position={item.position}>
        <LabelImageButton
          label={item.label}
          width={item.width}
          height={item.height}
          imgSrc={item.imgSrc}
          onClick={item.onClick}
        />
      </HeaderPanel>
    );
  } else if (item.type === 'Logo') {
    return (
      <HeaderPanel
        width={theme.size.snbWidth}
        key={item.id}
        position={item.position}
      >
        <HeaderLogoImage/>
      </HeaderPanel>
    );
  } else if (item.type === 'ReportTabs') {
    return (
      <HeaderPanel
        width={item.width}
        height={theme.size.headerHeight}
        itemAlignment='flex-start'
        key={item.id}
        position={item.position}
      >
        <ReportTitleTabs/>
      </HeaderPanel>
    );
  } else {
    return <></>;
  }
};

const itemIterator = (items, position) => {
  if (!items) return;

  // reverse로 인해 입력된 데이터가 수정될 가능성 막음
  const itemArr = [...items];

  if (position == 'right') {
    itemArr.reverse();
  }

  return itemArr.map((item) => {
    if (typeof item === 'string') {
      return getHeaderItem({...headerDefaultElement()[item], position});
    } else if (item) {
      return getHeaderItem({...item, position});
    }
  });
};

const Header = ({left, right}) => {
  return (
    <StyledHeader>
      <Left>
        {itemIterator(left, 'left')}
      </Left>
      <Right>
        {itemIterator(right, 'right')}
      </Right>
    </StyledHeader>
  );
};

export default Header;
