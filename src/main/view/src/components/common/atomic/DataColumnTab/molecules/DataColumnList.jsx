import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import SmallImageButton from '../../Common/Button/SmallImageButton';
import resetImg from 'assets/image/icon/button/reset_layout.png';
import plusImg from 'assets/image/icon/button/plus.png';
import PanelTitleText from '../../Common/Panel/PanelTitleText';
import {Draggable, Droppable} from 'react-beautiful-dnd';
import DataColumn from './DataColumn';
import {selectCurrentDataField, selectCurrentDataFieldOption, selectCurrentItem}
  from 'redux/selector/ItemSelector';
import {useSelector, useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import store from 'redux/modules';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';

const theme = getTheme();

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  color: ${theme.color.gray600};

  & + & {
    padding-top: 0px;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
`;


const Icon = styled.img`
  width: 16px;
  height: 16px;
  float: left;
  margin-right: 5px;
  margin-top: 2px;
`;

const ListWrapper = styled.div`
  height: auto;
  width: 100%;
  border: 1px solid ${theme.color.gray100};
  border-radius: 6px;
  margin: 10px 0px 20px 0px;
  padding: 5px;
`;

const EmptyColumnList = styled.div`
  color: ${theme.color.gray400};
  font: ${theme.font.dataColumnMsg};
  height: 40px;
  display: flex;
  flex-direction: column;
  align-itmes: center;
  justify-content: center;

  &::before {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    margin: 0px auto;
    background: url(${plusImg}) no-repeat;
  }
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
  const item = useSelector(selectCurrentItem);
  const dataFields = useSelector(selectCurrentDataField);
  const dataFieldOptions = useSelector(selectCurrentDataFieldOption);
  const columns = dataFields[id];
  const dispatch = useDispatch();
  let sortItems = [];

  // TODO: 소스개선 필요 (일정 외 사항 참고)removeDuplicate
  for (const key in dataFieldOptions) {
    if (dataFields[key].length > 0) {
      const option = dataFieldOptions[key];
      if (option.type == 'MEA') {
        sortItems = sortItems.concat(dataFields[key].map((field) => ({
          text: field.caption,
          value: field.fieldId,
          type: 'SortBy'
        })));
      } else if (option.type == 'ANY') {
        sortItems = sortItems.concat(dataFields[key].reduce((acc, field) => {
          if (field.type == 'MEA') {
            const tempField = {
              text: field.caption,
              value: field.fieldId,
              type: 'SortBy'
            };

            acc.push(tempField);
          }

          return acc;
        }, []));
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
                    itemType={item?.type}
                    reportId={reportId}
                    type={type}
                    sortOrder={column.sortOrder}
                    showContextMenu={true}
                    data={column}
                    provided={provided}
                    index={index}
                    useButton={useButton}
                    buttonEvent={buttonEvent}
                    buttonIcon={
                      typeof buttonIcon === 'function' ?
                      buttonIcon(column) : buttonIcon
                    }
                    sortItems={sortItems}
                  >
                    {column.caption}
                  </DataColumn>
                )}
              </Draggable>
            )}
            {columns.length === 0 &&
              <EmptyColumnList>
                {label}을 드래그해서 넣으세요.
              </EmptyColumnList>
            }
            {columns.length > 0 && provided.placeholder}
          </ListWrapper>
        )}
      </Droppable>
    </Wrapper>
  );
};

export default DataColumnList;
