import {Droppable} from 'react-beautiful-dnd';
import Filter from './Filter';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const StyledFilterBarWrapper = styled.div`
    height: 100%;
    min-height: ${theme.size.filterBarHeight};
    width: calc(100% - 20px);
    background: ${(props) => props.isExpand ?
      theme.color.filterBarExpand : theme.color.filterBar};
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    box-sizing: border-box;
    border-bottom: 1px solid ${theme.color.breakLine};
  `;

const FilterBarWrapper = (props) => {
  return (
    <Droppable droppableId="filter-bar">
      {(provided) => (
        <StyledFilterBarWrapper
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {
            props.tempFitlerData.sort((a, b) => {
              return a.ORDER - b.ORDER;
            }).map((filter) =>
              <Filter key={filter.PARAM_NM} data={filter}/>)
          }
        </StyledFilterBarWrapper>
      )}
    </Droppable>
  );
};

export default FilterBarWrapper;
