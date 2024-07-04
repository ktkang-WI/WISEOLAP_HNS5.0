import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Header from 'components/common/atomic/Header/organism/Header';
import SideNavigationBar from
  'components/common/atomic/SideNavigation/organism/SideNavigationBar';
import {getTheme} from 'config/theme';
import {Outlet} from 'react-router-dom';

const theme = getTheme();

// Config 는 임시용 입니다.
const Config = () => {
  const left = ['Logo', 'Viewer'];
  return (
    <Wrapper
      display='flex' direction='column'
    >
      <Wrapper
        size={`0 0 ${theme.size.headerHeight}`}
      >
        <Header
          left={left}
          right={['UserInfo']}
        >
        </Header>
      </Wrapper>
      <Wrapper
        height='calc(100% - 62px)'
        display='flex'
        direction='row'>
        <Wrapper
          size={`0 0 ${theme.size.snbWidth}`}>
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
      </Wrapper>
    </Wrapper>
  );
};
export default Config;
