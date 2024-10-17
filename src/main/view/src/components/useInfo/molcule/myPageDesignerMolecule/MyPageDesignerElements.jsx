import useModal from 'hooks/useModal';
import styled from 'styled-components';
import FavoritModal from '../../myPageModal/FavoritModal';
import {
  LayoutApplyCheckBox,
  MyDesignerLabel,
  MyPageTextBox
} from '../../atom/MyDesignerAtom';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import refresh from 'assets/image/icon/button/refresh.png';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import Title from 'components/config/atoms/common/Title';

const theme = getTheme();

const StyledImg = styled.img`
  src: ${(props) => props.src};
  cursor: pointer;
  margin-left: 10px;
`;

const smallButton = {
  height: '30px',
  borderRadius: '4px',
  font: theme.font.smallButton
};

const SideMenuWrapper = styled.div`
  height: auto;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--gray100);
  padding: 10px;
  box-sizing: border-box;
  text-align: left;
`;

const ContentWrapper = styled.div`
  float: left;
  width: 100%;
`;

const Content = styled.div`
  display: inline-flex;
  & > .favoritTextBox{
    padding-right: 10px;
  }

  .dx-checkbox-text {
    margin-right: 20px;
  }
`;

const MyPageDesignerElements = ({setConfig, data, items, prog}) => {
  const {openModal, confirm} = useModal();

  const onClickReset = (id) => {
    setConfig({
      ...data,
      ...(id?.id ? {[id.id]: null, [id.requiredNm]: null} : {[id]: null})
    });
  };

  const handleClick = (modalTitle, itemId) => {
    openModal(FavoritModal, {
      id: itemId.id || itemId,
      data: data,
      title: modalTitle,
      onSubmit: (value) => {
        // 변경.
        if (value.id.indexOf('favorite') > -1) {
          value.id = parseInt(value.id.substring(8, value.id.length));
        }
        if (!itemId || !value) return;
        // 기본보고서 처럼 이름이 필요한경우.
        if (itemId.requiredNm) {
          setConfig({...data,
            [itemId.id]: value.id,
            [itemId.requiredNm]: value.name,
            reportType: value.reportType
          });
        } else {
          setConfig({...data, [itemId]: value});
        }
      }
    });
  };

  const getDesignerSetting = (item) => {
    if (data.operation) {
      setConfig({});
      return;
    }
    const value =
        item.id.requiredNm ? data[item.id.requiredNm] : data[item.id];

    switch (item.type) {
      case 'favorit': // 기본 보고서, 아이템, 색상
        return (
          <>
            <MyPageTextBox value={value}/>
            <CommonButton
              {...smallButton}
              type='secondary'
              width='auto'
              padding='0px 10px'
              // itemId 객체인 경우 = Name도 필요한 경우
              onClick={() => handleClick(item.title, item.id)}
            >
              {item.btnLabel}
            </CommonButton>
          </>
        );
      case 'checkAndSelect': // 비정형레이아웃, 초기화면설정
        return (
          <>
            <LayoutApplyCheckBox
              id={item.id}
              setConfig={setConfig}
              data={data}/>
          </>
        );
      default:
        return (<></>);
    }
  };

  return (
    items.map((item) => {
      if ((item.id === 'maxReportQueryPeriod') && !prog.reportQueryPeriod) {
        return null; // 해당 item을 렌더링하지 않음
      }
      return (
        <>
          <Title title={item.title}>
            {
              item.type == 'favorit' &&
              <StyledImg
                src={refresh}
                onClick={() => confirm(
                    localizedString.eachItemResetConfirm[item.id.id || item.id],
                    () => onClickReset(item.id)
                )}
              />
            }
          </Title>
          <SideMenuWrapper>
            <ContentWrapper>
              <MyDesignerLabel label={item.label}/>
              <Content>
                {getDesignerSetting(item)}
              </Content>
            </ContentWrapper>
          </SideMenuWrapper>
        </>
      );
    })
  );
};
export default MyPageDesignerElements;
