import {DragDropContext} from 'react-beautiful-dnd';
import CustomDrawer from '../common/atoms/CustomDrawer';
// import ReportContent from 'components/common/atoms/ReportContent';
import Content from 'components/common/atoms/Content';
import AttributeTabs from 'components/common/organisms/AttributeTabs';
import DataSourceTab from 'components/common/organisms/DataSourceTab';
import ReportContentWrapper from 'components/common/atoms/ReportContentWrapper';
import FilterBar from 'components/common/organisms/FilterBar';
import Wrapper from 'components/common/atoms/Wrapper';
import ItemBoard from 'components/report/organisms/ItemBoard';

const DesignerContent = ({children}) => {
  return (
    <Content
      snbWidth={theme.size.snbWidth}
      headerHeight={theme.size.headerHeight}
      ribbonHeight={theme.size.ribbonHeight}
    >
      <DragDropContext>
        <CustomDrawer index={0} component={DataSourceTab}>
          <CustomDrawer index={1} component={AttributeTabs}>
            <Wrapper>
              <ReportContentWrapper>
                <FilterBar/>
                <ItemBoard/>
              </ReportContentWrapper>
            </Wrapper>
          </CustomDrawer>
        </CustomDrawer>
      </DragDropContext>
    </Content>
  );
};

export default DesignerContent;
