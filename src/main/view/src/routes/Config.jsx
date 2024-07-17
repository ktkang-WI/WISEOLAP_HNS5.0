import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Header from 'components/common/atomic/Header/organism/Header';
import SideNavigationBar from
  'components/common/atomic/SideNavigation/organism/SideNavigationBar';
import {getTheme} from 'config/theme';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Outlet, useLoaderData} from 'react-router-dom';
import ConfigSlice from 'redux/modules/ConfigSlice';

const theme = getTheme();

// Config 는 임시용 입니다.
const Config = () => {
  const left = ['Logo', 'Viewer'];
  const userNm = useLoaderData();
  const dispatch = useDispatch();
  const {setUserNm} = ConfigSlice.actions;

  useEffect(() => {
    dispatch(setUserNm(userNm));
  }, []);
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
