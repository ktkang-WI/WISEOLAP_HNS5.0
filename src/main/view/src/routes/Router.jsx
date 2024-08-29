import {createBrowserRouter} from 'react-router-dom';
import Designer from './Designer';
import Dashboard from 'components/designer/Dashboard';
import Adhoc from 'components/designer/Adhoc';
import Viewer from './Viewer';
import Config from './Config';
import Login from './Login';
import Register from 'components/login/organisms/Register';
import SignIn from 'components/login/organisms/SignIn';
import Spreadsheet from 'components/designer/Spreadsheet';
import UserGroupManagement
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import {
  authorityLoader,
  generalConfigure as generalLoader,
  userFolderData as myPageFolderData,
  myPageUserInfoData,
  userDesignerConfig,
  userGroupManagement as userGroupLoader} from './loader/LoaderConfig';
import ConfigurationSetting
  from 'components/config/organisms/configurationSetting/ConfigurationSetting';
import Authority
  from 'components/config/organisms/authority/Authority';
import {DesignerMode} from 'components/config/configType';
import ReportFolderManagement from
  'components/config/organisms/reportFolderManagement/ReportFolderManagement';
import DataSourceAddition
  from 'components/config/organisms/dataSourceAddition/DataSourceAddition';
import LinkViewer from './LinkViewer';
import MyPage from 'components/useInfo/organism/Mypage';
import ReportFolderTab
  from 'components/useInfo/organism/myReportAndFolder/ReportFolderTab';
import UserInfoManagement
  from 'components/useInfo/organism/myInformation/UserInfoManagement';
import MyDesignerConfig
  from 'components/useInfo/organism/myDesigner/MyDesignerConfig';
import MyViewerConfig
  from 'components/useInfo/organism/myViewer/MyViewerConfig';
import MyFontConfig from 'components/useInfo/organism/myFont/MyFontConfig';
import Log from 'components/config/organisms/log/Log';
import SearchQuery from 'components/config/organisms/searchQuery/SearchQuery';

import {getUserNmLoader} from './loader/MyPageLoaderConfig';

export const contextPath = '/editds';
const multipleLoader = async () => {
  const generalConfigure = await generalLoader().then((result) => {
    return result;
  });

  const myPageConfigure = await userDesignerConfig().then((result) => {
    if (result == null) return result;

    const object = result;
    const json = JSON.parse(object.defaultItem);

    object.defaultItem = json?.item || '';
    object.defaultLayout = {
      check: json?.check || false,
      layout: json?.layout || 'CTGB'
    };
    object.defaultDisplay = {
      displayCheck: json?.displayCheck || false,
      initDisplay: json?.initDisplay || 'DashAny'
    };

    return object;
  });

  const useLoaderData = await getUserNmLoader().then((result) => {
    return result;
  });

  return {
    generalConfigure: generalConfigure.generalConfigure,
    myPageConfigure: myPageConfigure,
    userNm: useLoaderData
  };
};
const router = createBrowserRouter([
  {
    path: contextPath,
    element: <Login/>,
    children: [
      {
        index: true,
        element: <SignIn/>
      },
      {
        path: contextPath + '/regist',
        element: <Register/>
      }
    ]
  },
  { // 초기 화면
    path: contextPath + '',
    element: <Designer/>,
    loader: multipleLoader,
    children: [
      {
        path: DesignerMode['DASHBOARD'].toLowerCase(),
        element: <Dashboard/>
      },
      {
        path: DesignerMode['AD_HOC'].toLowerCase(),
        element: <Adhoc/>
      },
      {
        path: DesignerMode['EXCEL'].toLowerCase(),
        element: <Spreadsheet/>
      }
    ]
  },
  {
    path: contextPath + '/viewer',
    element: <Viewer/>,
    loader: multipleLoader
  },
  {
    path: contextPath + '/linkviewer',
    element: <LinkViewer/>,
    loader: multipleLoader
  },
  {
    path: contextPath + '',
    element: <Config/>,
    loader: multipleLoader,
    children: [
      {
        path: 'confgeneral',
        element: <ConfigurationSetting/>,
        loader: generalLoader
      },
      {
        path: 'confusergroup',
        element: <UserGroupManagement/>,
        loader: userGroupLoader
      },
      {
        path: 'confauth',
        element: <Authority/>,
        loader: authorityLoader
      },
      {
        path: 'confreportfolder',
        element: <ReportFolderManagement/>
      },
      {
        path: 'confdatasourceadd',
        element: <DataSourceAddition/>
      },
      {
        path: 'conflog',
        element: <Log/>
      },
      {
        path: 'search-query',
        element: <SearchQuery/>
      }
    ]
  },
  {
    path: contextPath + '',
    element: <MyPage/>,
    loader: getUserNmLoader,
    children: [
      {
        path: 'mypageuserinfo',
        element: <UserInfoManagement/>,
        loader: myPageUserInfoData
      },
      {
        path: 'mypagereportfolder',
        element: <ReportFolderTab/>,
        loader: myPageFolderData
      },
      {
        path: 'mypageviewer',
        element: <MyViewerConfig/>,
        loader: userDesignerConfig
      },
      {
        path: 'mypagefont',
        element: <MyFontConfig/>
        // loader: 폰트 설정
      },
      {
        path: 'mypagedesigner',
        element: <MyDesignerConfig/>,
        loader: userDesignerConfig
      }
    ]
  }
]);

export default router;
