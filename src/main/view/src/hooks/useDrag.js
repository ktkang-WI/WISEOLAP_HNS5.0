import ItemSlice from 'redux/modules/ItemSlice';
import {
  selectCurrentDataset
} from 'redux/selector/DatasetSelector';
import {
  selectCurrentItem
} from 'redux/selector/ItemSelector';
import {
  selectCurrentReportId
} from 'redux/selector/ReportSelector';
import {useDispatch} from 'react-redux';
import store from 'redux/modules';
// TODO: redux 적용 이후 해당 예제 참고하여 데이터 이동 구현
// https://codesandbox.io/s/react-beautiful-dnd-copy-and-drag-5trm0?file=/index.js:4347-4351

const useDrag = () => {
  const {updateItemField} = ItemSlice.actions;
  const dispatch = useDispatch();

  const comparePos = (destination, source) => {
    return destination && destination.droppableId == source.droppableId &&
        destination.index == source.index;
  };

  const onDragStart = (e) => {

  };

  const onDragEnd = (e) => {
    const selectedItem = selectCurrentItem(store.getState());
    const selectedDataset = selectCurrentDataset(store.getState());
    const reportId = selectCurrentReportId(store.getState());
    const dest = e.destination;
    const source = e.source;
    const targetId = e.draggableId;

    if (comparePos(dest, source) ||
      (source.droppableId == 'dataSource' && !dest)) {
      return;
    }

    if (dest) {
      if (source.droppableId == 'dataSource') {
        const dataField = _.cloneDeep(
            selectedItem.meta.dataField
        );
        const sourceField = selectedDataset.fields.find((field) =>
          field.uniqueName == targetId
        );

        const tempField = {
          name: sourceField.name,
          uniqueName: sourceField.uniqueName,
          caption: sourceField.name,
          fieldId: 'dataItem' + (dataField.dataFieldQuantity++),
          category: dest.droppableId
        };

        dataField[dest.droppableId].splice(dest.index, 0, tempField);
        dataField.datasetId = selectedDataset.datasetId;
        dispatch(updateItemField({reportId, dataField}));
      } else {
        const dataField = _.cloneDeep(
            selectedItem.meta.dataField
        );

        let sourceItem = dataField[source.droppableId]
            .splice(source.index, 1);

        sourceItem = {...sourceItem[0], category: dest.droppableId};

        // TODO: 추후 데이터 항목 contextMenu 기능 추가시 데이터 교체 필요
        // 현재는 해당 기능이 필요 없으므로 아이템 복제만 함.
        dataField[dest.droppableId].splice(dest.index, 0, sourceItem);

        dispatch(updateItemField({reportId, dataField}));
      }
    } else if (source.droppableId != 'dataSource') {
      const dataField = _.cloneDeep(selectedItem.meta.dataField);

      dataField[source.droppableId].splice(source.index, 1);
      dispatch(updateItemField({reportId, dataField}));
    }
  };

  return {onDragStart, onDragEnd};
};

export default useDrag;
