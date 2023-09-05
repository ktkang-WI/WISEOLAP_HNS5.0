import {styled} from 'styled-components';
import AttributeTabs from './AttributeTabs';
import DataSourceTab from './DataSourceTab';
import {getTheme} from 'config/theme';

const theme = getTheme();

const Wrapper = styled.div`
  width: calc(${theme.size.panelWidth} * 2);
  height: 100%;
  display: flex;
`;

const ViewerDataAttributePanels = () => {
  return (
    <Wrapper>
      <DataSourceTab/>
      <AttributeTabs/>
    </Wrapper>
  );
};

export default ViewerDataAttributePanels;
