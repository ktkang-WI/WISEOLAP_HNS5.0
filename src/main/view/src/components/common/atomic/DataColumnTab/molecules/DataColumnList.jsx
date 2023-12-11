import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import SmallImageButton from '../../Common/Button/SmallImageButton';
import resetImg from 'assets/image/icon/button/reset_layout.png';
import PanelTitleText from '../../Common/Panel/PanelTitleText';
import {Draggable, Droppable} from 'react-beautiful-dnd';
import DataColumn from './DataColumn';
import {selectCurrentDataField, selectCurrentDataFieldOption}
  from 'redux/selector/ItemSelector';
import {useSelector, useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import store from 'redux/modules';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';

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
      <DataColumn provided={provided} index={rubric.source.index}>
        {item.caption}
      </DataColumn>
    );
  };

  return getDraggableItem;
};

const DataColumnList = ({
  id, icon, label, type, placeholder,
  useButton, buttonIcon, onClick, buttonEvent, key
}) => {
  const {setItemField} = ItemSlice.actions;
  const reportId = selectCurrentReportId(store.getState());
  const dataFields = useSelector(selectCurrentDataField);
  const dataFieldOptions = useSelector(selectCurrentDataFieldOption);
  const columns = dataFields[id];
  const dispatch = useDispatch();
  let sortItems = [];

  for (const key in dataFieldOptions) {
    if (dataFields[key].length > 0) {
      const option = dataFieldOptions[key];
      if (option.type == 'MEA') {
        sortItems = sortItems.concat(dataFields[key].map((field) => ({
          text: field.caption,
          value: field.name
        })));
      }
    }
  }

  const resetDataColumn = () => {
    const temp = {
      ...dataFields,
      [id]: []
    };

    dispatch(setItemField({reportId, dataField: temp}));
  };

  return (
    <Wrapper>
      <Title>
        <PanelTitleText>
          <Icon src={icon}></Icon>
          {label}
        </PanelTitleText>
        <SmallImageButton src={resetImg} onClick={() => resetDataColumn(id)}/>
      </Title>
      <Droppable droppableId={id} renderClone={getRenderItem(columns)}>
        {(provided) => (
          <ListWrapper
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {columns.map((column, index) =>
              <Draggable
                key={column.fieldId}
                draggableId={column.fieldId}
                index={index}>
                {(provided) => (
                  <DataColumn
                    reportId={reportId}
                    type={type}
                    sortOrder={column.sortOrder}
                    showContextMenu={true}
                    data={column}
                    provided={provided}
                    index={index}
                    useButton={useButton}
                    buttonEvent={buttonEvent}
                    buttonIcon={buttonIcon}
                    sortItems={sortItems}
                  >
                    {column.caption}
                  </DataColumn>
                )}
              </Draggable>
            )}
            {columns.length === 0 &&
              <Draggable
                key={id + 'temp'}
                draggableId={id + 'temp'}
                index={0}
                isDragDisabled={true}
              >
                {(provided) => (
                  <DataColumn
                    key={label}
                    provided={provided}
                    fixed={true}
                  >
                    {placeholder}
                  </DataColumn>
                )}
              </Draggable>
            }
            {columns.length > 0 && provided.placeholder}
          </ListWrapper>
        )}
      </Droppable>
    </Wrapper>
  );
};

export default DataColumnList;
