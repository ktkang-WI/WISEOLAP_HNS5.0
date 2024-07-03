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
import {createContext} from 'react';

export const AppContext = createContext();

function App() {
  loadMessages(deMessages);
  locale(navigator.language);
  const {controllers} = useAxiosSetting();
  const context = {
    controllers: controllers
  };

  return (
    <div className='App'>
      <AppContext.Provider
        value={context}>
        <RouterProvider router={router}/>
        <LoadingPanel></LoadingPanel>
      </AppContext.Provider>
    </div>
  );
}

export default App;
