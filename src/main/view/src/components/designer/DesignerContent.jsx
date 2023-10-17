import {DragDropContext} from 'react-beautiful-dnd';
import CustomDrawer from '../common/atomic/Common/Interactive/CustomDrawer';
import Content from 'components/common/atomic/Common/Content/Content';
import AttributeTabs
  from 'components/common/atomic/AttributeTab/AttributeTabs';
import DataSourceTab
  from 'components/common/atomic/DataSourceTab/DataSourceTab';
import ReportContentWrapper
  from 'components/common/atomic/Common/Wrap/ReportContentWrapper';
import FilterBar from 'components/common/atomic/FilterBar/organism/FilterBar';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import ItemBoard from 'components/report/organisms/ItemBoard';
import {getTheme} from 'config/theme';
import useDrag from 'hooks/useDrag';
// import ItemBoard2 from 'components/report/organisms/ItemBoard2';

const theme = getTheme();

const DesignerContent = ({children}) => {
  const {onDragEnd, onDragStart} = useDrag();
  return (
    <Content
      snbWidth={theme.size.snbWidth}
      headerHeight={theme.size.headerHeight}
      ribbonHeight={theme.size.ribbonHeight}
    >
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
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
