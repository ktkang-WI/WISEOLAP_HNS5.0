import {DragDropContext} from 'react-beautiful-dnd';
import CustomDrawer from '../common/atoms/CustomDrawer';
import ReportContent from 'components/common/atoms/ReportContent';
import Content from 'components/common/atoms/Content';
import DataSourceTab from 'components/common/organisms/DataSourceTab';
import AttributeTabs from 'components/common/organisms/AttributeTabs';
import ReportContentWrapper from 'components/common/atoms/ReportContentWrapper';
import FilterBar from 'components/common/organisms/FilterBar';
import Wrapper from 'components/common/atoms/Wrapper';
import ReportTabs from 'components/common/organisms/ReportTabs';
import {getTheme} from 'config/theme';

const theme = getTheme();

const ViewerContent = ({children}) => {
  return (
    <Content
      headerHeight={theme.size.headerHeight}
    >
      <DragDropContext>
        <CustomDrawer index={0} component={ReportTabs}>
          <CustomDrawer index={1} opened={false} component={DataSourceTab}>
            <CustomDrawer index={2} opened={false} component={AttributeTabs}>
              <Wrapper>
                <ReportContentWrapper>
                  <FilterBar/>
                  <ReportContent>
                    {children}
                  </ReportContent>
                </ReportContentWrapper>
              </Wrapper>
            </CustomDrawer>
          </CustomDrawer>
        </CustomDrawer>
      </DragDropContext>
    </Content>
  );
};

export default ViewerContent;
