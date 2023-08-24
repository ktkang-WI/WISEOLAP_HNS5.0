import Header from 'components/common/organisms/Header';
import './App.css';
import SideNavigationBar from 'components/common/organisms/SideNavigationBar';
import Ribbon from 'components/common/organisms/Ribbon';

function App() {
  return (
    <div className="App">
      <Header
        left={['Logo', 'Viewer', 'NewWindow', 'ReportTabs']}
        right={['ShowQuery', 'ReportProperty']}
      />
      <SideNavigationBar
        content={['Dashboard', 'AdHoc', 'Dataset', 'Preference']}
      />
      <Ribbon
        left={[
          'NewReport',
          'LoadReport',
          'SaveReport',
          'DeleteReport',
          'DownloadReport'
        ]}
        middle={[
          'ConnectReport',
          'AddContainer'
        ]}
        right={[
          'AddChart',
          'AddPivotGrid',
          'AddGrid',
          'AddCustomChart'
        ]}
        customMenu={[
          'CaptionView',
          'NameEdit',
          'Rotate',
          'XAxisSetting',
          'YAxisSetting',
          'ExtraAxisSetting',
          'ShowColorLegend',
          'BarTwo',
          'Palette',
          'ColorEdit',
          'PointLabel'
        ]}
        querySearch={[
          'QuerySearch'
        ]}
      />
    </div>
  );
}

export default App;
