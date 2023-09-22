import {DragDropContext} from 'react-beautiful-dnd';
import CustomDrawer from '../common/atomic/Common/Interactive/CustomDrawer';
import ReportContent
  from 'components/common/atomic/Common/Content/ReportContent';
import Content from 'components/common/atomic/Common/Content/Content';
import ReportContentWrapper
  from 'components/common/atomic/Common/Wrap/ReportContentWrapper';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import ReportTabs from 'components/common/atomic/ReportTab/organism/ReportTabs';
import {getTheme} from 'config/theme';
import ViewerFilterBar
  from 'components/common/atomic/FilterBar/organism/ViewerFilterBar';
import ViewerDataAttributePanels
  from 'components/viewer/ViewerDataAttributePanels';

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
            component={ViewerDataAttributePanels}
            opened={false}
            visible={false}
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
