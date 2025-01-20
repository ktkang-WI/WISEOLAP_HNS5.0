import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Header from 'components/common/atomic/Header/organism/Header';
import SideNavigationBar from
  'components/common/atomic/SideNavigation/organism/SideNavigationBar';
import {getTheme} from 'config/theme';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Outlet, useLoaderData, useNavigate} from 'react-router-dom';
import ConfigSlice from 'redux/modules/ConfigSlice';
import useConfig from 'hooks/useConfig';

const theme = getTheme();

// Config 는 임시용 입니다.
const Config = () => {
  const left = ['Logo', 'Portal', 'Viewer'];
  const {userNm, myPageConfigure, generalConfigure} = useLoaderData();
  const dispatch = useDispatch();
  const {setUserNm} = ConfigSlice.actions;
  const nav = useNavigate();
  const {saveConfiguration} = useConfig();

  const [tabItems, setTabItems] = useState();

  const adminTab = [
    'ConfigurationSetting',
    'UserGroupManagement',
    'Authority',
    'ReportFolderManagement',
    'DataSourceAddition',
    'Log',
    'SearchQuery',
    'PortalConfig'
  ];

  const userTab = [
    'Log',
    'SearchQuery'
  ];

  if (myPageConfigure != undefined) {
    saveConfiguration(generalConfigure, myPageConfigure);
  } else {
    nav('/editds');
  }

  useEffect(() => {
    if (window.location.pathname.indexOf('adhoc') > -1 ||
        window.location.pathname.indexOf('dashany') > -1 ||
        window.location.pathname.indexOf('excel') > -1 ||
        (
          window.location.pathname.indexOf('conf') > -1 &&
          window.location.pathname.indexOf('my') <0
        )
    ) {
      if (myPageConfigure?.runMode === 'VIEW') {
        nav('viewer');
      } else if (myPageConfigure?.runMode === 'VIEW') {
        nav('viewer');
      }
    }

    const prog = generalConfigure?.prog;

    if (prog?.settings) {
      if (prog.excelUpload || prog.resourceMap) adminTab.push('ExcelResource');
      setTabItems(adminTab);
    } else {
      if (prog.excelUpload || prog.resourceMap) userTab.push('ExcelResource');
      setTabItems(userTab);
      nav('conflog');
    }

    if (userNm != null && userNm != '') {
      dispatch(setUserNm(userNm));
    } else {
      nav('/editds');
    }
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
            content={tabItems}
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
