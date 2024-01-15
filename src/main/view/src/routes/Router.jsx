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
import {DesignerMode} from 'components/config/configType';

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
        path: DesignerMode['DASHBOARD'].toLowerCase(),
        element: <Dashboard/>
      },
      {
        path: DesignerMode['AD_HOC'].toLowerCase(),
        element: <Adhoc/>
      },
      {
        path: DesignerMode['SPREAD_SHEET'].toLowerCase(),
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
    element: <Config/>
  }
]);

export default router;
