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
  generalConfigure as generalLoader,
  groupData as groupDataLoader,
  userFolderData as myPageFolderData,
  userDesignerConfig,
  userGroupManagement as userGroupLoader} from './loader/LoaderConfig';
import ConfigurationSetting
  from 'components/config/organisms/configurationSetting/ConfigurationSetting';
import Authority from 'components/config/organisms/authority/Authority';
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

export const contextPath = '/editds';
const multipleLoader = async () => {
  const generalConfigure = await generalLoader().then((result) => {
    return result;
  });

  const myPageConfigure = await userDesignerConfig().then((result) => {
    if (result == null) return result;

    const object = result;
    const json = JSON.parse(object.defaultItem);

    object.defaultItem = json.item;
    object.defaultLayout = {check: json.check, layout: json.layout};

    return object;
  });

  return {
    generalConfigure: generalConfigure.generalConfigure,
    myPageConfigure: myPageConfigure
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
    path: contextPath + '/linkViewer',
    element: <LinkViewer/>,
    loader: generalLoader
  },
  {
    path: contextPath + '/config',
    element: <Config/>,
    children: [
      {
        path: 'general',
        element: <ConfigurationSetting/>,
        loader: generalLoader
      },
      {
        path: 'user-group',
        element: <UserGroupManagement/>,
        loader: userGroupLoader
      },
      {
        path: 'auth',
        element: <Authority/>,
        loader: groupDataLoader
      },
      {
        path: 'report-folder',
        element: <ReportFolderManagement/>
      },
      {
        path: 'add-datasource',
        element: <DataSourceAddition/>
      },
      {
        path: 'log',
        element: <Log/>
      }
    ]
  },
  {
    path: contextPath + '/myPage',
    element: <MyPage/>,
    children: [
      {
        path: 'user-info',
        element: <UserInfoManagement/>
        // loader: 개인정보
      },
      {
        path: 'myReport-folder',
        element: <ReportFolderTab/>,
        loader: myPageFolderData
      },
      {
        path: 'myPage-viewerConfig',
        element: <MyViewerConfig/>
        // loader: 뷰어 설정
      },
      {
        path: 'myPage-fontConfig',
        element: <MyFontConfig/>
        // loader: 폰트 설정
      },
      {
        path: 'myPage-designerConfig',
        element: <MyDesignerConfig/>,
        loader: userDesignerConfig
      }
    ]
  }
]);

export default router;
