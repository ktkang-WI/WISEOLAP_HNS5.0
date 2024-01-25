import {RouterProvider} from 'react-router-dom';
import router from './routes/Router';
import 'devextreme/dist/css/dx.light.css';
import './App.css';
import LoadingPanel
  from 'components/common/atomic/Loading/organisms/LoadingPanel';
import useAxiosSetting from 'hooks/useAxiosSetting';

function App() {
  useAxiosSetting();

  return (
    <div className='App'>
      <RouterProvider router={router}/>
      <LoadingPanel></LoadingPanel>
    </div>
  );
}

export default App;
