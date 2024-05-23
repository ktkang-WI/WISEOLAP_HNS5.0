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
import ReportTitleText from '../../ReportTitleTab/atom/ReportTitleText';
import {useSelector} from 'react-redux';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import CommonButton from '../../Common/Button/CommonButton';
import division from 'assets/image/icon/button/Rectangle_327.png';
import {Popover} from 'devextreme-react';

const theme = getTheme();

const Division = styled.img`
  src: ${(props) => props.src};
  padding-right: 20px;
  padding-left: 10px;
`;

const StyledHeader = styled.div`
  width: 100vw;
  height: ${theme.size.headerHeight};
  border-bottom: solid 1px ${theme.color.breakLine};
  background: ${theme.color.panelColor};
  box-sizing: border-box;
`;

const Left = styled.div`
  width: 33%;
  height: 100%;
  text-align: left;
  float: left;
  display: flex;
  flex-shrink: 0;
`;

const Right = styled.div`
  width: 33%;
  height: 100%;
  text-align: right;
  float: right;
`;

const Middle = styled.div`
  width: 33%;
  float: left;
  text-align: center;
  left: 0px;
`;

const Header = ({left, middle, right}) => {
  const headerDefaultItems = headerDefaultElement();
  const report = useSelector(selectCurrentReport);

  const getHeaderItem = (item) => {
    if (item.type === 'AnimatedImageButton') {
      return (
        <HeaderPanel
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
          cursor={item.cursor}
          onClick={item.onClick}
        >
          <HeaderLogoImage height={item.height}/>
        </HeaderPanel>
      );
    } else if (item.type === 'ReportTab') {
      return (
        <HeaderPanel
          width={item.width}
          height={theme.size.headerHeight}
          itemAlignment='flex-start'
          key={item.id}
          position={item.position}
        >
          <ReportTitleText
            font={theme.font.reportTitleForDesigner}
          >{report.options.reportNm}</ReportTitleText>
        </HeaderPanel>
      );
    } else if (item.type === 'ReportTabs') {
      return (
        <HeaderPanel
          width={item.width}
          height={theme.size.headerHeight}
          itemAlignment='flex-start'
          verticalAlignment='end'
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
    } else if (item.type === 'CommonButton') {
      return (
        <HeaderPanel
          breakLine={item.index !== item.length - 1}
          key={item.id}
          width={'auto'}
          position={item.position}>
          <CommonButton
            title={item.label}
            type={item.buttonType}
            width={item.width}
            height={'32px'}
            onClick={item.onClick}
          >
            {item.icon && <img src={item.icon}/>}
            {' '}
            {item.label}
          </CommonButton>
        </HeaderPanel>
      );
    } else if (item.type === 'UserInfoButton') {
      return (
        <HeaderPanel
          width={'auto'}
          position={item.position}
        >
          <Division src={division}/>
          <CommonButton
            id={item.id}
            title={item.label}
            type={item.buttonType}
            width={item.width}
            height={'32px'}
            onClick={item.onClick}
          >
            <span>안녕하세요!&ensp;&ensp;</span>
            <span
              style={{textDecoration: 'underline',
                color: '#005196'
              }}>{item.label + ' 님'}</span>
            <Popover
              target={'#' + item.id}
              contentRender={item.contentRender}
              // popover 속성
              {...item.popoverProps}
            >
            </Popover>
          </CommonButton>
          &ensp;&ensp;
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

  return (
    <StyledHeader>
      <Left>
        {itemIterator(left, 'left')}
      </Left>
      <Middle>
        {itemIterator(middle, 'middle')}
      </Middle>
      <Right>
        {itemIterator(right, 'right')}
      </Right>
    </StyledHeader>
  );
};

export default Header;
