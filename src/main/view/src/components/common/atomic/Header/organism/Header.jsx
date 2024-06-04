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
import UserInfoButtonUI from '../atom/UserInfoButtonUI';

const theme = getTheme();

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
    const useInfoBtn =
      item.id == 'user_info_popover' && <UserInfoButtonUI name={item.label}/>;

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
          >
            {item.id === 'myPage' ? item.name : report.options.reportNm}
          </ReportTitleText>
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
            id={item.id}
            title={item.label}
            type={item.buttonType}
            width={item.width}
            height={'32px'}
            onClick={item.onClick}
            usePopover={item.usePopover}
            popoverProps={item.popoverProps}
            contentRender={item.contentRender}
          >
            {item.icon && <img src={item.icon}/>}
            {useInfoBtn ? useInfoBtn : ' ' + item.label}
          </CommonButton>
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
      if (item['myPage']) {
        return getHeaderItem(item['myPage']);
      }
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
