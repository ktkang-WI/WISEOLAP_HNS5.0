import {styled} from 'styled-components';
import AttributeTabs from './AttributeTabs';
import DataSourceTab from './DataSourceTab';

const Wrapper = styled.div`
  width: 500px;
  height: 100%;
  display: flex;
`;

const ViewerDataSourceTab = () => {
  return (
    <Wrapper>
      <DataSourceTab/>
      <AttributeTabs/>
    </Wrapper>
  );
};

export default ViewerDataSourceTab;
