import Header from 'components/common/atomic/Header/organism/Header';
import {getTheme} from 'config/theme';
import {Outlet} from 'react-router-dom';
import styled from 'styled-components';
import MyPageMenuButtons from '../molcule/MyPageMenuButtons';

const theme = getTheme();

const tabNm = '마이페이지'; // localized
const myPageUIParam =
  {
    name: tabNm,
    type: 'ReportTab',
    width: 'auto',
    id: 'myPage',
    position: 'middle'
  };

const StyledWrapper = styled.div`
  height: calc(100% - ${theme.size.headerHeight});
  width: 240px;
  flex: 1;
  display: flex;
  float: left;
  min-height: 0px;
  margin-bottom: 0px;
  box-sizing: border-box;
  margin: 10px;
  background: #ffffff;
`;
const SideMenuWrapper = styled.div`
  height: 100%;
  width: inherit;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #D4D7DC;
  padding: 10px;
  box-sizing: border-box;
`;

const ButtonWrap = styled.div`
  border: 1px solid #D4D7DC;
  padding: 10px;
  box-sizing: border-box;
`;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

const menuButtons = [ // label localizedString
  {id: 'user_info', label: '개인정보 관리', path: '/user-info'},
  {
    id: 'myDesigner_config',
    label: '디자이너 설정',
    path: '/myPage-designerConfig'
  },
  {id: 'myViewer_config',
    label: '뷰어 설정',
    path: '/myPage-viewerConfig'},
  {id: 'myFont_config',
    label: '폰트 설정',
    path: '/myPage-fontConfig'},
  {id: 'myReport_folder', label: '개인 보고서 및 폴더 관리', path: '/myReport-folder'}
];

const MyPage = () => {
  return (
    <>
      <Wrapper>
        <Header
          left={['Logo']}
          middle={[{'myPage': myPageUIParam}]}
          right={[
            'ReportProperty',
            'UserInfo'
          ]}
        >
        </Header>
        <StyledWrapper>
          <SideMenuWrapper>
            {/* 메뉴 버튼 */}
            <ButtonWrap>
              <MyPageMenuButtons btns={menuButtons}/>
            </ButtonWrap>
          </SideMenuWrapper>
        </StyledWrapper>
        <div style={{display: 'flex'}}>
          <Outlet/>
        </div>
      </Wrapper>
    </>
  );
};
export default MyPage;
