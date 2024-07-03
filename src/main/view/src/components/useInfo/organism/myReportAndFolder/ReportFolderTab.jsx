import CommonTab
  from 'components/common/atomic/Common/Interactive/CommonTab';
import {dataSource} from './MyPageDataSource';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

const TabPanelItem = ({data}) => {
  return data.component;
};

const ReportFolderTab = () => {
  return (
    <Wrapper>
      <CommonTab
        className='dx-theme-background-color'
        width='100%'
        height='100%'
        tabWidth={'200px'}
        dataSource={dataSource}
        animationEnabled={false}
        swipeEnabled={false}
        itemComponent={TabPanelItem}
      >
      </CommonTab>
    </Wrapper>
  );
};
export default ReportFolderTab;
