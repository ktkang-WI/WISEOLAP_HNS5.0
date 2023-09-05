import {DragDropContext} from 'react-beautiful-dnd';
import CustomDrawer from '../common/atoms/CustomDrawer';
import ReportContent from 'components/common/atoms/ReportContent';
import Content from 'components/common/atoms/Content';
import ReportContentWrapper from 'components/common/atoms/ReportContentWrapper';
import Wrapper from 'components/common/atoms/Wrapper';
import ReportTabs from 'components/common/organisms/ReportTabs';
import {getTheme} from 'config/theme';
import ViewerFilterBar from 'components/common/organisms/ViewerFilterBar';
import ViewerDataSourceTab
  from 'components/common/organisms/ViewerDataSourceTab';

const theme = getTheme();

const ViewerContent = ({children}) => {
  return (
    <Content
      headerHeight={theme.size.headerHeight}
    >
      <DragDropContext>
        <CustomDrawer
          index={0}
          component={ReportTabs}
        >
          <CustomDrawer
            index={1}
            opened={false}
            component={ViewerDataSourceTab}
          >
            <Wrapper>
              <ReportContentWrapper>
                <ViewerFilterBar/>
                <ReportContent>
                  {children}
                </ReportContent>
              </ReportContentWrapper>
            </Wrapper>
          </CustomDrawer>
        </CustomDrawer>
      </DragDropContext>
    </Content>
  );
};

export default ViewerContent;
