import Content from 'components/common/atomic/Common/Content/Content';
import CustomDrawer from
  'components/common/atomic/Common/Interactive/CustomDrawer';
import DataSourceTab from
  'components/common/atomic/DataSourceTab/DataSourceTab';
import FilterBar from 'components/common/atomic/FilterBar/organism/FilterBar';
import {getTheme} from 'config/theme';
import {DragDropContext} from 'react-beautiful-dnd';
import useDrag from 'hooks/useDrag';
import SpreadBoard from '../report/atomic/spreadBoard/organisms/SpreadBoard';
import ReportContentWrapper
  from 'components/common/atomic/Common/Wrap/ReportContentWrapper';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {useEffect, useState} from 'react';

const theme = getTheme();

const SpreadContent = () => {
  // draggable을 사용할지 안할지 논의
  const {onDragEnd, onDragStart} = useDrag();
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [fullscreen]);

  return (
    <Content
      snbWidth={theme.size.snbWidth}
      headerHeight={theme.size.headerHeight}
      ribbonHeight={'-10px'}
    >
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <CustomDrawer index={0} component={DataSourceTab}>
          <Wrapper className={fullscreen ? 'full-screen' : ''}>
            <ReportContentWrapper>
              <FilterBar
                fullscreen={fullscreen}
                useFullscreenButton={true}
                handleFullscreen={() => setFullscreen(!fullscreen)}
                useSearchButton={true}/>
              <SpreadBoard/>
            </ReportContentWrapper>
          </Wrapper>
        </CustomDrawer>
      </DragDropContext>
    </Content>
  );
};

export default SpreadContent;
