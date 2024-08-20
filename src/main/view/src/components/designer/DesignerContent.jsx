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
import ItemBoards from
  'components/report/atomic/ItemBoard/organisms/ItemBoards';
import {getTheme} from 'config/theme';
import useDrag from 'hooks/useDrag';

const theme = getTheme();

const DesignerContent = () => {
  const {onDragEnd, onDragStart} = useDrag();
  return (
    <Content
      snbWidth={theme.size.snbWidth}
      headerHeight={theme.size.headerHeight}
      ribbonHeight={theme.size.ribbonHeight}
    >
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <CustomDrawer index={0} component={DataSourceTab}>
          <CustomDrawer index={1} component={AttributeTabs} margin={'0px'}>
            <Wrapper>
              <ReportContentWrapper>
                <FilterBar/>
                <ItemBoards/>
              </ReportContentWrapper>
            </Wrapper>
          </CustomDrawer>
        </CustomDrawer>
      </DragDropContext>
    </Content>
  );
};

export default DesignerContent;
