import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Header from 'components/common/atomic/Header/organism/Header';
import SideNavigationBar from
  'components/common/atomic/SideNavigation/organism/SideNavigationBar';
import {getTheme} from 'config/theme';
import {Outlet} from 'react-router-dom';
import styled from 'styled-components';

const theme = getTheme();

const Container = styled.div`
  width: 100%;
  height: 89.8%;
  display: ${(props)=> props.display ? props.display : 'block'};
  flex-direction: ${(props)=> props.direction ? props.direction : 'row'};
  flex: 0 0 ${(props)=>props.size ? props.size : 1};
  justify-content: ${(props)=>props.center ? props.center : 'start'};
`;

// Config 는 임시용 입니다.
const Config = () => {
  const left = ['Logo'];
  return (
    <>
      <Header
        left={left}
        right={[
          'Viewer',
          'NewWindow',
          'ShowQuery',
          'ReportProperty'
        ]}
      >
      </Header>
      <Container display='flex' direction='row'>
        <Wrapper size={theme.size.snbWidth}>
          <SideNavigationBar
            content={['환경 설정', '사용자/그룹관리', '권한']}
          />
        </Wrapper>
        <Wrapper>
          <Outlet/>
        </Wrapper>
      </Container>
    </>
  );
};
export default Config;
