import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import HeaderPanel from 'components/common/atomic/Common/Panel/HeaderPanel';
import HeaderLogoImage
  from 'components/common/atomic/Common/Image/HeaderLogoImage';
import AnimatedImageButton
  from 'components/common/atomic/Common/Button/AnimatedImageButton';
import ReportTitleTabs from '../../ReportTitleTab/ReportTitleTabs';
import LabelImageButton from '../../Common/Button/LabelImageButton';
import headerDefaultElement from './HeaderDefaultElement';
import TextButton from '../../Common/Button/TextButton';
import {Link} from 'react-router-dom';

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
      <HeaderPanel
        breakLine={item.index !== item.length - 1}
        key={item.id}
        position={item.position}>
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
      <HeaderPanel
        key={item.id}
        position={item.position}
        breakLine={item.index !== item.length - 1}
      >
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
        width={item.width}
        key={item.id}
        position={item.position}
        breakLine={item.index !== item.length - 1}
      >
        <Link to={'/editds/'}>
          <HeaderLogoImage height={item.height}/>
        </Link>
      </HeaderPanel>
    );
  } else if (item.type === 'ReportTabs') {
    return (
      <HeaderPanel
        width={item.width}
        height={theme.size.headerHeight}
        itemAlignment='flex-start'
        breakLine={item.index !== item.length - 1}
        key={item.id}
        position={item.position}
      >
        <ReportTitleTabs/>
      </HeaderPanel>
    );
  } else if (item.type === 'TextButton') {
    return (
      <HeaderPanel
        breakLine={item.index !== item.length - 1}
        key={item.id}
        width={'auto'}
        position={item.position}>
        <TextButton
          title={item.label}
          height={theme.size.headerHeight}
          onClick={item.onClick}
        >
          {item.label}
        </TextButton>
      </HeaderPanel>
    );
  } else {
    return <></>;
  }
};

const itemIterator = (headerDefaultItems, items, position) => {
  if (!items) return;

  // reverse로 인해 입력된 데이터가 수정될 가능성 막음
  const itemArr = [...items];

  if (position == 'right') {
    itemArr.reverse();
  }

  return itemArr.map((item, i) => {
    if (typeof item === 'string') {
      return getHeaderItem({
        ...headerDefaultItems[item],
        position,
        index: i,
        length: position == 'right'? 1 : itemArr.length
      });
    } else if (item) {
      return getHeaderItem({...item,
        position,
        index: i,
        length: position == 'right'? 1 : itemArr.length
      });
    }
  });
};

const Header = ({left, right}) => {
  const headerDefaultItems = headerDefaultElement();
  return (
    <StyledHeader>
      <Left>
        {itemIterator(headerDefaultItems, left, 'left')}
      </Left>
      <Right>
        {itemIterator(headerDefaultItems, right, 'right')}
      </Right>
    </StyledHeader>
  );
};

export default Header;
