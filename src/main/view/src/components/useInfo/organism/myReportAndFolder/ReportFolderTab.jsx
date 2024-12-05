import CommonTab
  from 'components/common/atomic/Common/Interactive/CommonTab';
import {dataSource, Mode} from './MyPageDataSource';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import UserFolderManagement from './UserFolderManagement';
import UserReprotManagement from './UserReportManagement';
import {useState} from 'react';

const ReportFolderTab = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const getTabContent = ({data}) => {
    if (data.mode === Mode['FOLDER_MANAGEMENT']) {
      return (
        <UserFolderManagement val={selectedTab}/>
      );
    }

    if (data.mode === Mode['REPORT_MANAGEMENT']) {
      return (
        <UserReprotManagement val={selectedTab}/>
      );
    }
  };

  return (
    <Wrapper>
      <CommonTab
        onSelectionChanged={(e) => setSelectedTab(selectedTab + 1)}
        className='dx-theme-background-color'
        width='100%'
        height='100%'
        tabWidth={'200px'}
        dataSource={dataSource}
        animationEnabled={false}
        swipeEnabled={false}
        itemComponent={getTabContent}
      >
      </CommonTab>
    </Wrapper>
  );
};
export default ReportFolderTab;
