import {RouterProvider} from 'react-router-dom';
import router from './routes/Router';
import 'devextreme/dist/css/dx.light.css';
import {locale, loadMessages} from 'devextreme/localization';
import deMessages from 'config/localization/devExpress/ko.json';
import './dx.css';
import './App.css';
import LoadingPanel
  from 'components/common/atomic/Loading/organisms/LoadingPanel';
import useAxiosSetting from 'hooks/useAxiosSetting';
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import
'@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css';
import useConfig from 'hooks/useConfig';

function App() {
  loadMessages(deMessages);
  locale(navigator.language);
  useAxiosSetting();
  const {saveConfiguration} = useConfig();
  saveConfiguration();

  return (
    <div className='App'>
      <RouterProvider router={router}/>
      <LoadingPanel></LoadingPanel>
    </div>
  );
}

export default App;
