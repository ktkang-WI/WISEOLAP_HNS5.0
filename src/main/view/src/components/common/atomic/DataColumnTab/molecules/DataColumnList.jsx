import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import SmallImageButton from '../../Common/Button/SmallImageButton';
import resetLayoutImg
  from '../../../../../assets/image/icon/button/reset_layout.png';
import PanelTitleText from '../../Common/Panel/PanelTitleText';
import {Draggable, Droppable} from 'react-beautiful-dnd';
import DataColumn from './DataColumn';

const theme = getTheme();

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  padding: 20px;

  & + & {
    padding-top: 0px;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
`;


const Icon = styled.img`
  width: 20px;
  height: 20px;
  float: left;
  margin-right: 5px;
`;

const ListWrapper = styled.div`
  height: auto;
  width: 100%;
  border: 1px dashed ${theme.color.dashedBorder};
  margin: 20px 0px;
  padding: 5px;
`;

const getRenderItem = (items) => {
  const getDraggableItem = (provided, snapshot, rubric) => {
    const item = items[rubric.source.index];
    return (
      <DataColumn column={item} provided={provided} index={rubric.source.index}>
        {item.name}
      </DataColumn>
    );
  };

  return getDraggableItem;
};


const DataColumnList = ({
  id, icon, label, columns, type, placeholder,
  useButton, buttonIcon, onClick, buttonEvent
}) => {
  return (
    <Wrapper>
      <Title>
        <PanelTitleText>
          <Icon src={icon}></Icon>
          {label}
        </PanelTitleText>
        <SmallImageButton src={resetLayoutImg}/>
      </Title>
      <Droppable droppableId={id} renderClone={getRenderItem(columns)}>
        {(provided) => (
          <ListWrapper
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {columns.map((column, index) =>
              <Draggable
                key={column.uniqueName}
                draggableId={column.uniqueName}
                index={index}>
                {(provided) => (
                  <DataColumn
                    type={type}
                    sortOrder={column.sortOrder}
                    showContextMenu={true}
                    data={column}
                    provided={provided}
                    index={index}
                    useButton={useButton}
                    buttonEvent={buttonEvent}
                    buttonIcon={buttonIcon}
                  >
                    {column.name}
                  </DataColumn>
                )}
              </Draggable>
            )}
            {columns.length === 0 &&
              <DataColumn
                key={label}
                provided={provided}
              >
                {placeholder}
              </DataColumn>
            }
            {columns.length > 0 && provided.placeholder}
          </ListWrapper>
        )}
      </Droppable>
    </Wrapper>
  );
};

export default DataColumnList;
