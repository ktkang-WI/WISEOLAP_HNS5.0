import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Header from 'components/common/atomic/Header/organism/Header';
import SideNavigationBar from
  'components/common/atomic/SideNavigation/organism/SideNavigationBar';
import {getTheme} from 'config/theme';
import {Outlet} from 'react-router-dom';

const theme = getTheme();

const Config = () => {
  const left = ['Logo'];
  return (
    <Wrapper
      display='flex' direction='column'
    >
      <Wrapper
        size={`0 0 ${theme.size.headerHeight}`}
      >
        <Header
          left={left}
          right={[
            'Viewer',
            'NewWindow',
            'ReportProperty'
          ]}
        >
        </Header>
      </Wrapper>
      <Wrapper
        display='flex'
        direction='row'>
        <Wrapper
          size={`0 0 ${theme.size.snbWidth}`}>
          <SideNavigationBar
            content={['ConfigurationSetting', 'UserGroupManagement',
              'Authority', 'ReportFolderManagement', 'DataSourceAddition']}
          />
        </Wrapper>
        <Wrapper>
          <Outlet/>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};
export default Config;
