import useModal from 'hooks/useModal';
import styled from 'styled-components';
import FavoritModal from '../../myPageModal/FavoritModal';
import {
  LayoutApplyCheckBox,
  MyDesignerLabel,
  MyPageTextBox
} from '../../atom/MyDesignerAtom';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import {getTheme} from 'config/theme';
import Title from 'components/config/atoms/common/Title';

const theme = getTheme();

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

const MyPageDesignerElements = ({setConfig, data, items}) => {
  const {openModal} = useModal();

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
              {...smallButton}
              type='secondary'
              width='auto'
              padding='0px 10px'
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
          <Title title={item.title}/>
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
