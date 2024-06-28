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
  height: calc(100% - ${theme.size.headerHeight});
  display: ${(props)=> props.display ? props.display : 'block'};
  flex-direction: ${(props)=> props.direction ? props.direction : 'row'};
  flex: 0 0 ${(props)=>props.size ? props.size : 1};
  justify-content: ${(props)=>props.center ? props.center : 'start'};

  * {
    box-sizing: border-box;
  }

  .dx-multiview-item-content {
    overflow: auto;
  }
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
          'ReportProperty'
        ]}
      >
      </Header>
      <Container display='flex' direction='row'>
        <Wrapper
          className='section'
          width={theme.size.snbWidth}
          height={'calc(100% - 20px)'}
        >
          <SideNavigationBar
            content={[
              'ConfigurationSetting',
              'UserGroupManagement',
              'Authority',
              'ReportFolderManagement',
              'DataSourceAddition',
              'Log',
              'SearchQuery'
            ]}
          />
        </Wrapper>
        <Wrapper
          className='section'
          width={'calc(100% - ' + theme.size.snbWidth + ' - 20px)'}
          height={'calc(100% - 20px)'}
        >
          <Outlet/>
        </Wrapper>
      </Container>
    </>
  );
};
export default Config;
