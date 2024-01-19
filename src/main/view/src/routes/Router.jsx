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
  userGroupManagement as userGroupLoader} from './loader/LoaderConfig';
import ConfigurationSetting
  from 'components/config/organisms/configurationSetting/ConfigurationSetting';

const contextPath = '/editds';

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
    children: [
      {
        path: 'dashboard',
        element: <Dashboard/>
      },
      {
        path: 'adhoc',
        element: <Adhoc/>
      },
      {
        path: 'spreadsheet',
        element: <Spreadsheet/>
      }
    ]
  },
  {
    path: contextPath + '/viewer',
    element: <Viewer/>
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
      }
    ]
  }
]);

export default router;
