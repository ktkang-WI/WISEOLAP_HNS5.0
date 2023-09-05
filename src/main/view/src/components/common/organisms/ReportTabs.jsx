import Drawer from 'devextreme/ui/drawer';
import localizedString from '../../../config/localization';
import CommonTab from '../atoms/CommonTab';
import CommonToolbar from '../atoms/CommonToolbar';
import Wrapper from '../atoms/Wrapper';
import tempData from '../molecules/ReportFoldableListTempData';

import ReportListTab from './ReportListTab';

const ReportTabSource = [
  {
    id: 'publicReport',
    title: localizedString.publicReport
  },
  {
    id: 'privateReport',
    title: localizedString.privateReport
  }
];

const ToolbarItems = [
  {
    location: 'before',
    key: '1',
    widget: 'dxButton',
    options: {
      icon: 'inactivefolder',
      onClick: () => {
        const element = document.getElementById('ReportListCustomDrawer');
        const instance = Drawer.getInstance(element);

        instance.toggle();
      }
    }
  },
  {
    location: 'after',
    key: '2',
    widget: 'dxButton',
    options: {
      icon: 'refresh',
      onClick: () => {
      }
    }
  }
];

const ReportTabs = () => {
  const getTabContent = ({data}) => {
    return <ReportListTab items={tempData[data.id]}/>;
  };

  return (
    <Wrapper>
      <CommonToolbar items={ToolbarItems}/>
      <CommonTab
        dataSource={ReportTabSource}
        itemComponent={getTabContent}
      />
    </Wrapper>
  );
};

export default ReportTabs;
