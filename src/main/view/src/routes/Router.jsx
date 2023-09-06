import {createBrowserRouter} from 'react-router-dom';
import Designer from './Designer';
import Dashboard from 'components/designer/Dashboard';
import Adhoc from 'components/designer/Adhoc';
import SpreadSheet from 'components/designer/SpreadSheet';
import Viewer from './Viewer';
import Config from './Config';
import Login from './Login';
import Register from 'components/login/organisms/Register';
import SignIn from 'components/login/organisms/SignIn';

const contextPath = '/editds';
const firstPage = {
  unstruct: {index: false, element: <Adhoc/>},
  dashboard: {index: true, element: <Dashboard/>},
  exel: {index: false, element: <SpreadSheet/>}
};

const router = createBrowserRouter([
  { // 초기 화면
    path: contextPath,
    element: <Designer/>,
    children: [
      {
        index: firstPage.dashboard.index,
        element: firstPage.dashboard.element
      },
      {
        path: 'dashboard',
        element: <Dashboard/>
      },
      {
        path: 'Adhoc',
        element: <Adhoc/>
      },
      {
        path: 'spreadsheet',
        element: <SpreadSheet/>
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
  },
  {
    path: contextPath + '/login',
    element: <Login/>,
    children: [
      {
        index: true,
        element: <SignIn/>
      },
      {
        path: contextPath + '/login/regist',
        element: <Register/>
      }
    ]
  }
]);

export default router;
