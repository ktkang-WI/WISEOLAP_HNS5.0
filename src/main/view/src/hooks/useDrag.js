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
import {makeMetaDataField, metaDataField}
  from 'components/report/item/util/metaUtilityFactory';
// TODO: redux 적용 이후 해당 예제 참고하여 데이터 이동 구현
// https://codesandbox.io/s/react-beautiful-dnd-copy-and-drag-5trm0?file=/index.js:4347-4351

const useDrag = () => {
  const {setItemField} = ItemSlice.actions;
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
    const dataField = _.cloneDeep(selectedItem.meta.dataField);
    const dataFieldOption = _.cloneDeep(selectedItem.mart.dataFieldOption);
    const dest = e.destination;
    const source = e.source;
    const targetId = e.draggableId;

    const getNewDataField = (sourceField) => {
      const getDataFieldType = () => {
        const category = dest.droppableId;
        if (category === 'field') {
          return sourceField.type;
        }
        return dataFieldOption[category].type;
      };

      let tempField = {
        name: sourceField.name,
        uniqueName: sourceField.uniqueName,
        caption: sourceField.name,
        category: dest.droppableId,
        fieldType: sourceField.type, // 데이터 항목 원본 타입
        type: getDataFieldType() // 실제 조회할 때 적용되어야 할 type
      };

      const dimensionOption = {
        sortBy: sourceField.name,
        sortOrder: 'ASC'
      };

      const measureOption = {
        // 포멧옵션
        format: {},
        summaryType: tempField.fieldType == 'MEA' ? 'SUM' : 'MIN'
      };

      // 필드아이디가 있는 경우 기존 아이템 이동
      if (sourceField.fieldId) {
        tempField = {...sourceField, ...tempField};
      } else {
        tempField.fieldId = 'dataItem' + (dataField.dataFieldQuantity++);
      }

      if (!sourceField.fieldId ||
        (sourceField.fieldId && sourceField.type != tempField.type)) {
        if (tempField.type == 'MEA') {
          tempField = {...tempField, ...measureOption};
        } else {
          tempField = {...tempField, ...dimensionOption};
        }
      }
      if (metaDataField[tempField.category]) {
        tempField = makeMetaDataField(tempField, tempField.category);
      }
      return tempField;
    };

    // 목적지와 이동 위치가 같거나 dataSource에서 허공으로 떨구는 경우우
    if (comparePos(dest, source) ||
      (source.droppableId == 'dataSource' && !dest)) {
      return;
    }

    // TODO: 추후 주제영역 추가시 필터 생성 로직 및 기존 로직 예외처리 필요
    // Droppable 컴포넌트에 떨군 경우
    if (dest) {
      // dataSource에서 출발한 경우 새로운 데이터항목 객체 생성성
      if (source.droppableId == 'dataSource') {
        const sourceField = selectedDataset.fields.find((field) =>
          field.uniqueName == targetId
        );

        if (sourceField.type == 'FLD') return;

        const tempField = getNewDataField(sourceField);

        dataField[dest.droppableId].splice(dest.index, 0, tempField);
        dataField.datasetId = selectedDataset.datasetId;
        dispatch(setItemField({reportId, dataField}));
      } else {
        // 데이터 항목에서 출발한 경우 기존 데이터 항목 복제 및 삭제 후 추가
        let sourceField = dataField[source.droppableId]
            .splice(source.index, 1);

        sourceField = getNewDataField(sourceField[0]);

        // TODO: 추후 데이터 항목 contextMenu 기능 추가시 데이터 교체 필요
        // 현재는 해당 기능이 필요 없으므로 아이템 복제만 함.
        dataField[dest.droppableId].splice(dest.index, 0, sourceField);

        dispatch(setItemField({reportId, dataField}));
      }
    } else if (source.droppableId != 'dataSource') {
      // 데이터 항목을 끌어다 허공에 놓는 경우 삭제
      dataField[source.droppableId].splice(source.index, 1);
      dispatch(setItemField({reportId, dataField}));
    }
  };

  return {onDragStart, onDragEnd};
};

export default useDrag;
