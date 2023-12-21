import Content from 'components/common/atomic/Common/Content/Content';
import CustomDrawer from
  'components/common/atomic/Common/Interactive/CustomDrawer';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import DataSourceTab from
  'components/common/atomic/DataSourceTab/DataSourceTab';
import FilterBar from 'components/common/atomic/FilterBar/organism/FilterBar';
import {getTheme} from 'config/theme';
import {DragDropContext} from 'react-beautiful-dnd';
import useDrag from 'hooks/useDrag';
import SpreadBoard from '../report/atomic/spreadBoard/atomic/SpreadBoard';
import {useRef} from 'react';

const theme = getTheme();

const SpreadContent = () => {
  // draggable을 사용할지 안할지 논의
  const {onDragEnd, onDragStart} = useDrag();
  const spreadBoardRef = useRef();
  const spreadBoardHeight = spreadBoardRef.current?.offsetHeight;
  return (
    <Content
      snbWidth={theme.size.snbWidth}
      headerHeight={theme.size.headerHeight}
    >
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <CustomDrawer index={0} component={DataSourceTab}>
          <Wrapper>
            <FilterBar/>
            <SpreadBoard ref={spreadBoardRef} height={spreadBoardHeight}/>
          </Wrapper>
        </CustomDrawer>
      </DragDropContext>
    </Content>
  );
};

export default SpreadContent;
