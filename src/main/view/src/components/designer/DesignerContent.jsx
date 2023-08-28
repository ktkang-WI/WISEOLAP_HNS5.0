import {DragDropContext} from 'react-beautiful-dnd';
import CustomDrawer from '../common/atoms/CustomDrawer';
import ReportContent from 'components/common/atoms/ReportContent';
import Content from 'components/common/atoms/Content';
import AttributeTabs from 'components/common/organisms/AttributeTabs';
import DataSourceTab from 'components/common/organisms/DataSourceTab';
import ReportContentWrapper from 'components/common/atoms/ReportContentWrapper';
import FilterBar from 'components/common/organisms/FilterBar';
import Wrapper from 'components/common/atoms/Wrapper';

const DesignerContent = ({children}) => {
  return (
    <Content>
      <DragDropContext>
        <CustomDrawer index={0} component={DataSourceTab}>
          <CustomDrawer index={1} component={AttributeTabs}>
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
      </DragDropContext>
    </Content>
  );
};

export default DesignerContent;
