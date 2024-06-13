import {TextBox} from 'devextreme-react';
import useModal from 'hooks/useModal';
import {useState} from 'react';
import styled from 'styled-components';
import FavoritModal from '../myPageModal/FavoritModal';
import {
  LayoutApplyCheckBox,
  LayoutSelectBox,
  MyDesignerLabel,
  MyDesignerTitle
} from '../atom/MyDesignerAtom';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';

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
  // useState -> 기본 데이터 집합 : {defaultDaset: '자동차EX'}
  const [isCheck, setIsCheck] = useState(
    data.defaultLayout ? data.defaultLayout.check : false
  );
  const {openModal} = useModal();

  const handleClick = (modalTitle, id) => {
    openModal(FavoritModal, {
      id: id,
      data: data,
      title: modalTitle,
      onSubmit: (value) => {
        if (id == 'defaultReportId') {
          setConfig({...data,
            [id]: value.id,
            defaultReportNm: value.name
          });
        } else if (id == 'defaultReportId') {
          setConfig({...data,
            [id]: value.id,
            defaultDatasetNm: value.name
          });
        } else {
          setConfig({...data, [id]: value});
        }
      }
    });
  };

  const getDesignerSetting = (item) => {
    if (item.id !== 'defaultLayout') {
      const value =
        item.id == 'defaultReportId' ? data['defaultReportNm'] : data[item.id];

      return (
        <>
          <MyDesignerTitle title={item.title}/> {/* TODO: 초기화 이미지 추가.*/}
          <SideMenuWrapper>
            <ContentWrapper>
              <MyDesignerLabel label={item.label}/>
              <Content>
                <TextBox
                  className='favoritTextBox'
                  readOnly={true}
                  width= '400px'
                  value={value}
                />
                <CommonButton
                  type='secondary'
                  width='100px'
                  onClick={() => handleClick(item.title, item.id)}
                >
                  {item.label}
                </CommonButton>
              </Content>
            </ContentWrapper>
          </SideMenuWrapper>
        </>
      );
    } else if (item.id === 'defaultLayout') {
      const text = '비정형 레이아웃 설정';
      return (
        <>
          <MyDesignerTitle title={item.title}/> {/* TODO: 초기화 이미지 추가.*/}
          <SideMenuWrapper>
            <ContentWrapper>
              <MyDesignerLabel label={text}/>
              <Content>
                <LayoutApplyCheckBox
                  isCheck={isCheck}
                  setConfig={setConfig}
                  setIsCheck={setIsCheck}
                  data={data}
                />
                <LayoutSelectBox
                  data={data}
                  isCheck={isCheck}
                  setConfig={setConfig}
                />
              </Content>
            </ContentWrapper>
          </SideMenuWrapper>
        </>
      );
    } else {
      return (
        <></>
      );
    }
  };

  return (
    items.map((item) => getDesignerSetting(item))
  );
};
export default MyPageDesignerElements;
