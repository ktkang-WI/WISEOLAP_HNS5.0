import {createBrowserRouter} from 'react-router-dom';
import Designer from './routesInitialPage/Designer';
import Dashboard from 'components/designer/Dashboard';
import UnstructureReport from 'components/designer/UnstructrueReport';
import SpreadSheet from 'components/designer/SpreadSheet';
import Viewer from './routesInitialPage/Viewer';
import Config from './routesInitialPage/Config';
import Login from './routesInitialPage/Login';

const contextPath = '/editds';
const firstPage = {
  unstruct: {index: false, element: <UnstructureReport/>},
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
        path: 'dash',
        element: <Dashboard/>
      },
      {
        path: 'unstructure',
        element: <UnstructureReport/>
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
    element: <Login/>
  }
]);

export default router;
