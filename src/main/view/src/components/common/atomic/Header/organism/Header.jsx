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

import {selectEditMode} from 'redux/selector/ConfigSelector';
import {EditMode} from 'components/config/configType';

import DropdownBoxReportSearch from '../atom/DropdownBoxReportSearch';
import SmallImageButton from '../../Common/Button/SmallImageButton';

import favoriteImg from 'assets/image/icon/button/favorite.png';
import favoriteEmptyImg from 'assets/image/icon/button/favorite-empty.png';
import {addFavoriteReport, deleteFavoriteReport} from 'models/report/Report';
import {useDispatch} from 'react-redux';
import ReportSlice from 'redux/modules/ReportSlice';
import useModal from 'hooks/useModal';
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
  overflow: hidden;
`;

const Middle = styled.div`
  width: 33%;
  float: left;
  text-align: center;
  left: 0px;
  overflow: hidden;
`;

const Header = ({left, middle, right}) => {
  const headerDefaultItems = headerDefaultElement();
  const report = useSelector(selectCurrentReport);
  const editMode = useSelector(selectEditMode);

  // hook
  const dispatch = useDispatch();
  const {alert} = useModal();

  // slice
  const reportActions = ReportSlice.actions;

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
          <HeaderLogoImage id={item.id} height={item.height}/>
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
            onClick={item.onClick}
          >
            {editMode == EditMode.VIEWER && report.reportId == 0 ?
              '' : report.options.reportNm}

          </ReportTitleText>
          &nbsp;
          {report.reportId !== 0 &&
            <SmallImageButton
              key={'favorite-button'}
              title={'즐겨찾기'}
              onClick={() => {
                const uniqueId = report.options.uniqueId;
                const param = {
                  reportId: report.reportId
                };

                if (uniqueId?.includes('favorite')) {
                  // 즐겨찾기 삭제
                  deleteFavoriteReport(param).then((res) => {
                    try {
                      if (res.data) {
                        dispatch(reportActions.updateReportOptions({
                          reportId: report.reportId,
                          options: {
                            uniqueId: uniqueId.match(/\d+/)[0]
                          }
                        }));
                      } else {
                        console.log(res);
                        alert('즐겨찾기 삭제에 실패했습니다.\n 관리자에게 문의하세요.\n ');
                      }
                    } catch (e) {
                      console.error(e);
                      alert('즐겨찾기 삭제에 실패했습니다.\n 관리자에게 문의하세요.');
                    }
                  });
                } else {
                  // 즐겨찾기 추가
                  param.fldType = report.options.fldType;
                  addFavoriteReport(param).then((res) => {
                    try {
                      if (res.data) {
                        dispatch(reportActions.updateReportOptions({
                          reportId: report.reportId,
                          options: {
                            uniqueId: 'favorite' + report.reportId
                          }
                        }));
                      } else {
                        console.log(res);
                        alert('즐겨찾기 추가에 실패했습니다.\n 관리자에게 문의하세요.\n ');
                      }
                    } catch (e) {
                      console.error(e);
                      alert('즐겨찾기 추가에 실패했습니다.\n 관리자에게 문의하세요.');
                    }
                  });
                }
              }}
              src={report.options.uniqueId?.includes('favorite') ?
                favoriteImg : favoriteEmptyImg
              }
            />
          }
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
    } else if (item.type === 'DropdownBox') {
      return (
        <HeaderPanel
          breakLine={item.index !== item.length - 1}
          key={item.id}
          width={'auto'}
          position={item.position}>
          <DropdownBoxReportSearch
            report={report}
            button={item.button}
            id={item.id}
          />
        </HeaderPanel>
      );
    } else if (item.type === 'CustomTitle') {
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
            onClick={item.onClick}
          >
            {item.text}
          </ReportTitleText>
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
