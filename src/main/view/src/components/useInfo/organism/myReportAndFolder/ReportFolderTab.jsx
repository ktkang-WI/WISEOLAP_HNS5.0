import CommonTab
  from 'components/common/atomic/Common/Interactive/CommonTab';
import {dataSource} from './MyPageDataSource';
import styled from 'styled-components';

const Content = styled.div`
  height:100%;
  width:100%;
  display:flex;
  flex-direction: row;
  flex: 0 0 1;
  margin: 10px;
  border: 1px solid #D4D7DC;
  border-radius: 10px;
  box-sizing: border-box;
`;

const TabPanelItem = ({data}) => {
  return data.component;
};

const ReportFolderTab = () => {
  return (
    <Content>
      <CommonTab
        className='dx-theme-background-color'
        width='100%'
        height='100%'
        dataSource={dataSource}
        animationEnabled={false}
        swipeEnabled={false}
        itemComponent={TabPanelItem}
      >
      </CommonTab>
    </Content>
  );
};
export default ReportFolderTab;
