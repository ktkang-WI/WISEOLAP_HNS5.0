import useModal from 'hooks/useModal';
import styled from 'styled-components';
import FavoritModal from '../../myPageModal/FavoritModal';
import {
  LayoutApplyCheckBox,
  // LayoutSelectBox,
  MyDesignerLabel,
  MyDesignerTitle,
  MyPageTextBox
} from '../../atom/MyDesignerAtom';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import refresh from 'assets/image/icon/button/refresh.png';
import localizedString from 'config/localization';

const SideMenuWrapper = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #D4D7DC;
  padding: 10px;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  float: left;
  width: 100%;
`;

const Content = styled.div`
  display: inline-flex;
  & > .favoritTextBox{
    padding-right: 40px;
  }
`;

const MyPageDesignerElements = ({setConfig, data, items}) => {
  const {openModal, confirm} = useModal();
  const onClickReset = (id) => {
    if (id.id) {
      setConfig({...data, [id.id]: null, [id.requiredNm]: null});
    } else {
      setConfig({...data, [id]: null});
    }
    // eachItemReset(param);
  };

  const handleClick = (modalTitle, itemId) => {
    openModal(FavoritModal, {
      id: itemId.id || itemId,
      data: data,
      title: modalTitle,
      onSubmit: (value) => {
        // 기본보고서 처럼 이름이 필요한경우.
        if (itemId.requiredNm) {
          setConfig({...data,
            [itemId.id]: value.id,
            [itemId.requiredNm]: value.name
          });
        } else {
          setConfig({...data, [itemId]: value});
        }
      }
    });
  };

  const getDesignerSetting = (item) => {
    const value =
        item.id.requiredNm ? data[item.id.requiredNm] : data[item.id];

    switch (item.type) {
      case 'favorit': // 기본 보고서, 아이템, 색상
        return (
          <>
            <MyPageTextBox value={value}/>
            <CommonButton
              type='secondary'
              width='100px'
              // itemId 객체인 경우 = Name도 필요한 경우
              onClick={() => handleClick(item.title, item.id)}
            >
              {item.label}
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
      return (
        <>
          <MyDesignerTitle title={item.title}/>
          {
            item.type == 'favorit' &&
            <img
              src={refresh}
              onClick={() => confirm(
                  localizedString.eachItemResetConfirm[item.id.id || item.id],
                  () => onClickReset(item.id)
              )}
            />
          }
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
