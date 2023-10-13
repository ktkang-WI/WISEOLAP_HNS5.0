import ReportSlice from 'redux/modules/ReportSlice';
import {
  selectCurrentDataset
} from 'redux/selector/DatasetSelector';
import {
  selectCurrentReportItem
} from 'redux/selector/ReportSelector';
import {useDispatch} from 'react-redux';
import store from 'redux/modules';
// TODO: redux 적용 이후 해당 예제 참고하여 데이터 이동 구현
// https://codesandbox.io/s/react-beautiful-dnd-copy-and-drag-5trm0?file=/index.js:4347-4351

const useDrag = () => {
  const {updateItemField} = ReportSlice.actions;
  const dispatch = useDispatch();

  const comparePos = (destination, source) => {
    return destination && destination.droppableId == source.droppableId &&
        destination.index == source.index;
  };

  const onDragStart = (e) => {

  };

  const onDragEnd = (e) => {
    const selectedItem = selectCurrentReportItem(store.getState());
    const selectedDataset = selectCurrentDataset(store.getState());
    const dest = e.destination;
    const source = e.source;
    const targetId = e.draggableId;

    if (comparePos(dest, source) ||
      (source.droppableId == 'dataSource' && !dest)) {
      return;
    }

    if (dest) {
      if (source.droppableId == 'dataSource') {
        const dataFields = _.cloneDeep(
            selectedItem.meta.dataField
        );
        const sourceField = selectedDataset.fields.find((field) =>
          field.uniqueName == targetId
        );

        const tempField = {
          name: sourceField.name,
          uniqueName: sourceField.uniqueName,
          caption: sourceField.name,
          fieldId: 'dataItem' + (dataFields.dataFieldQuantity++)
        };

        dataFields[dest.droppableId].splice(dest.index, 0, tempField);
        dispatch(updateItemField(dataFields));
      } else {
        const dataFields = _.cloneDeep(
            selectedItem.meta.dataField
        );

        const sourceItem = dataFields[source.droppableId]
            .splice(source.index, 1);

        // TODO: 추후 데이터 항목 contextMenu 기능 추가시 데이터 교체 필요
        // 현재는 해당 기능이 필요 없으므로 아이템 복제만 함.
        dataFields[dest.droppableId].splice(dest.index, 0, sourceItem[0]);

        dispatch(updateItemField(dataFields));
      }
    } else if (source.droppableId != 'dataSource') {
      const dataFields = _.cloneDeep(selectedItem.meta.dataField);

      dataFields[source.droppableId].splice(source.index, 1);
      dispatch(updateItemField(dataFields));
    }
  };

  return {onDragStart, onDragEnd};
};

export default useDrag;
