import localizedString from '../../../config/localization';
import CommonTab from '../atoms/CommonTab';
import CommonToolbar from '../atoms/CommonToolbar';
import Wrapper from '../atoms/Wrapper';
import tempData from '../molecules/ReportFoldableListTempData';
import refresh from '../../../assets/image/icon/button/refresh.png';

import ReportListTab from './ReportListTab';
import SmallImageButton from '../atoms/SmallImageButton';

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
    location: 'after',
    key: '2',
    render: () => {
      return <SmallImageButton src={refresh}/>;
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
