import Header from './components/common/organisms/Header';
import './App.css';
import SideNavigationBar from './components/common/organisms/SideNavigationBar';
import Content from 'components/common/atoms/Content';
import CustomDrawer from 'components/common/atoms/CustomDrawer';
import DataSourceTab from 'components/common/organisms/DataSourceTab';
import 'devextreme/dist/css/dx.light.css';
import AttributeTabs from 'components/common/organisms/AttributeTabs';
import {DragDropContext} from 'react-beautiful-dnd';

function App() {
  return (
    <div className='App'>
      <Header
        left={['Logo', 'Viewer', 'NewWindow', 'ReportTabs']}
        right={['ShowQuery', 'ReportProperty']}
      >
      </Header>
      <SideNavigationBar
        content={['Dashboard', 'AdHoc', 'Dataset', 'Preference']}
      />
      <Content>
        <DragDropContext>
          <CustomDrawer component={DataSourceTab}>
            <CustomDrawer component={AttributeTabs}></CustomDrawer>
          </CustomDrawer>
        </DragDropContext>
      </Content>
    </div>
  );
}

export default App;
