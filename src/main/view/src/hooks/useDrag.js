import ItemSlice from 'redux/modules/ItemSlice';
import {
  selectCurrentDataset
} from 'redux/selector/DatasetSelector';
import {
  selectCurrentDataField,
  selectCurrentDataFieldOption
} from 'redux/selector/ItemSelector';
import {
  selectCurrentReportId
} from 'redux/selector/ReportSelector';
import {
  selectRootParameter
} from 'redux/selector/ParameterSelector';
import {useDispatch} from 'react-redux';
import store from 'redux/modules';
import ParamUtils from 'components/dataset/utils/ParamUtils';
import ParameterSlice from 'redux/modules/ParameterSlice';
import DatasetSlice from 'redux/modules/DatasetSlice';
import models from 'models';
import localizedString from 'config/localization';
import useModal from './useModal';
import {getNewDataField}
  from 'components/common/atomic/DataColumnTab/utils/utility';
import {currentDesignerExecution} from 'redux/selector/ExecuteSelector';
import ExecuteSlice from 'redux/modules/ExecuteSlice';
// eslint-disable-next-line max-len
import {getSeriesOptionDefaultFormat} from 'redux/modules/SeriesOption/SeriesOptionFormat';

// TODO: redux 적용 이후 해당 예제 참고하여 데이터 이동 구현
// https://codesandbox.io/s/react-beautiful-dnd-copy-and-drag-5trm0?file=/index.js:4347-4351

const defaultCalendarMap = {
  BTY: {
    calendarCaptionFormat: 'yyyy',
    calendarKeyFormat: 'yyyy',
    calendarPeriodBase: ['YEAR', 'YEAR'],
    calendarDefaultType: 'NOW',
    paramType: 'CALENDAR',
    operation: 'BETWEEN'
  },
  BTM: {
    calendarCaptionFormat: 'yyyyMM',
    calendarKeyFormat: 'yyyyMM',
    calendarPeriodBase: ['MONTH', 'MONTH'],
    calendarDefaultType: 'NOW',
    paramType: 'CALENDAR',
    operation: 'BETWEEN'
  },
  BTD: {
    calendarCaptionFormat: 'yyyyMMdd',
    calendarKeyFormat: 'yyyyMMdd',
    calendarPeriodBase: ['DAY', 'DAY'],
    calendarDefaultType: 'NOW',
    paramType: 'CALENDAR',
    operation: 'BETWEEN'
  }
};

const useDrag = () => {
  const {setItemField} = ItemSlice.actions;
  const {updateParameterInformation} = ParameterSlice.actions;
  const {updateDataset, datasetAppliedFields} = DatasetSlice.actions;
  const {updateDesinerExecutionState} = ExecuteSlice.actions;
  const dispatch = useDispatch();
  const {alert} = useModal();

  const comparePos = (destination, source) => {
    return destination && destination.droppableId == source.droppableId &&
        destination.index == source.index;
  };

  const onDragStart = (e) => {

  };

  const onDragEnd = (e) => {
    const selectedDataset = selectCurrentDataset(store.getState());
    const isExecute = currentDesignerExecution(store.getState());
    const reportId = selectCurrentReportId(store.getState());
    const dataField = _.cloneDeep(selectCurrentDataField(store.getState()));
    const dataFieldOption =
    _.cloneDeep(selectCurrentDataFieldOption(store.getState()));
    const dest = e.destination;
    const source = e.source;
    const targetId = e.draggableId;
    const datasetId = selectedDataset.datasetId;

    const itemDupleCheck = (field) => {
      const typeMap = dest.droppableId;
      if (typeMap === 'sortByItem') return false;
      const colTypeDatas = dataField[typeMap];

      if (colTypeDatas.length === 0) return false;

      const findIndex =
        colTypeDatas.findIndex((t) => t.uniqueName === field.uniqueName);

      if (findIndex > -1) {
        return true;
      }

      return false;
    };

    const checkFieldLimit = () => {
      const limit = dataFieldOption[dest.droppableId]?.limit;
      if (limit && dataField[dest.droppableId].length > limit) {
        alert(localizedString.dataFieldLimitMsg.replace('N', limit));
        return false;
      }

      return true;
    };

    const generateCubeParameter = (newParamInfo, sourceField, order, name) => {
      if (selectedDataset.datasetType == 'CUBE') {
        const param = {
          cubeId: selectedDataset.cubeId,
          uniqueName: sourceField.uniqueName
        };
        models.Cube.getCubeInfo(param)
            .then((response) => {
              if (response.status != 200) {
                return;
              }

              const cubeColumnInfo = response.data;
              const newParam =
                ParamUtils.newCubeParamInformation(
                    name,
                    selectedDataset.dsId,
                    selectedDataset.datasetType,
                    order ++,
                    cubeColumnInfo);
              newParam.dataset = [datasetId];
              if (newParam.name.includes('DATE')) {
                newParam.sortOrder = 'DESC';
              }
              newParamInfo.push(newParam);
              newParamInfo.sort((a, b) => a.order - b.order);

              newParamInfo = newParamInfo.
                  map((param) => {
                    const keyWord = ParamUtils.checkKeyWordCalendar(param);

                    if (keyWord && param.paramType !== 'CALENDAR') {
                      const defaultVal = defaultCalendarMap[keyWord];
                      param = {...param, ...defaultVal};
                      param = ParamUtils.setCalendarExceptionValue(param);
                    }

                    return ParamUtils.sanitizeParamInformation(param);
                  });

              dispatch(updateParameterInformation({
                datasetId: datasetId,
                reportId: reportId,
                informations: newParamInfo
              }));
            }).catch((e) => {
              console.log(e);
            });
      } else if (selectedDataset.datasetType == 'DS_SINGLE') {
        const newParam =
          ParamUtils.newSingleTableParamInformation(
              name,
              selectedDataset.dataSrcId,
              selectedDataset.datasetType,
              order ++,
              sourceField);
        newParam.dataset = [datasetId];

        newParamInfo.push(newParam);
        newParamInfo.sort((a, b) => a.order - b.order);

        newParamInfo = newParamInfo.
            map((param) => ParamUtils.sanitizeParamInformation(param));

        dispatch(updateParameterInformation({
          datasetId: datasetId,
          reportId: reportId,
          informations: newParamInfo
        }));

        const addParamaQuery = selectedDataset.datasetQuery +
                  ' AND A.' + newParam.uniqueName +
                  ' IN (' + name + ') \n';

        dispatch(updateDataset({
          reportId: reportId,
          dataset: {
            ...selectedDataset,
            datasetQuery: addParamaQuery
          }
        }));
      }
    };

    // 목적지와 이동 위치가 같거나 dataSource에서 허공으로 떨구는 경우우
    if (comparePos(dest, source) ||
      (source.droppableId == 'dataSource' && !dest)) {
      return;
    }

    // TODO: 추후 주제영역 추가시 필터 생성 로직 및 기존 로직 예외처리 필요
    // Droppable 컴포넌트에 떨군 경우
    if (dest) {
      if (dest.droppableId == 'filter-bar') {
        if (selectedDataset.datasetType != 'CUBE' &&
            selectedDataset.datasetType != 'DS_SINGLE') {
          alert(localizedString.filterErrorMsg);
          return;
        }

        const parameters = selectRootParameter(store.getState());
        const paramInfo = parameters.informations;
        let sourceField = null;
        if (source.droppableId == 'dataSource') {
          sourceField = selectedDataset.fields.find((field) =>
            field.uniqueName == targetId
          );
        } else {
          sourceField = dataField[source.droppableId]
              .splice(source.index, 1);
          sourceField = sourceField[0];

          dispatch(setItemField({reportId, dataField}));
        }

        const regExp = /[\[\]]/gi;
        const uniName = sourceField.uniqueName.replace(regExp, '')
            .replace('.', '_');
        const paramNames = ParamUtils.getCubeParameterNamesCube(
            paramInfo,
            '@'+uniName
        ) || [];

        const order = paramInfo.reduce((acc, param) => {
          if (acc <= param.order) {
            acc = param.order + 1;
          }
          return acc;
        }, 1);

        const newParamInfo = paramInfo.filter((info) => {
          const idx = paramNames.indexOf(info.name);
          // 기존에 있던 필터
          if (idx >= 0) {
            paramNames.splice(idx, 1);
            return true;
          }
          return false;
        });

        for (name of paramNames) {
          const org = parameters.informations.find((info) => info.name == name);
          if (org) {
            // 다른 데이터 집합에 동일한 이름을 가진 필터가 있는 경우우
            newParamInfo.push({
              ...org,
              dataset: org.dataset.concat([datasetId])
            });
          } else {
            generateCubeParameter(newParamInfo, sourceField, order, name);
          }
        }
      } else {
        // dataSource에서 출발한 경우 새로운 데이터항목 객체 생성
        if (source.droppableId == 'dataSource') {
          const sourceField = selectedDataset.fields.find((field) =>
            field.uniqueName == targetId
          );
          const param = {
            reportId: reportId,
            datasetId: selectedDataset.datasetId,
            uniqueName: sourceField.uniqueName
          };
          const noDragItems = ['FLD', 'DIMGRP', 'MEAGRP'];
          if (noDragItems.includes(sourceField.type)) return;

          const tempField = getNewDataField(
              dataField,
              dataFieldOption,
              sourceField,
              dest.droppableId);

          if (typeof tempField == 'string') {
            alert(tempField);
            dispatch(setItemField({reportId, dataField}));
            return;
          }

          const dupleCheck = itemDupleCheck(sourceField);
          if (dupleCheck) {
            alert('이미 존재하는 컬럼입니다.');
            return;
          }

          dataField[dest.droppableId].splice(dest.index, 0, tempField);

          dataField.datasetId = selectedDataset.datasetId;
          if (checkFieldLimit()) {
            // eslint-disable-next-line max-len
            if (tempField.category !== 'sortByItem' && tempField.category === 'measure') {
              const seriesOption = getSeriesOptionDefaultFormat();
              seriesOption.fieldId = tempField.fieldId;

              if (dataField['seriesOptions']) {
                // eslint-disable-next-line max-len
                dataField['seriesOptions'] = [...dataField['seriesOptions'], seriesOption];
              } else {
                dataField['seriesOptions'] = [seriesOption];
              }
            }

            dispatch(setItemField({reportId, dataField}));

            // 뷰어게시 기능으로 데이터항목에 올리기전 체크해제 후 해제한 항목을 다시 올린경우 처리.
            if (selectedDataset.selectedFields) {
              dispatch(datasetAppliedFields(param));
            }

            if (isExecute) {
              dispatch(updateDesinerExecutionState(false));
            }
          }
        } else if (source.droppableId == dest.droppableId) {
          const sourceField = dataField[source.droppableId]
              .splice(source.index, 1);

          dataField[dest.droppableId].splice(dest.index, 0, sourceField[0]);

          if (checkFieldLimit()) {
            dispatch(setItemField({reportId, dataField}));
          }
        } else {
          // 데이터 항목에서 출발한 경우 기존 데이터 항목 복제 및 삭제 후 추가
          let sourceField = dataField[source.droppableId]
              .splice(source.index, 1);

          sourceField = getNewDataField(
              dataField,
              dataFieldOption,
              sourceField[0],
              dest.droppableId);

          if (typeof sourceField == 'string') {
            alert(sourceField);
            return;
          }

          const dupleCheck = itemDupleCheck(sourceField);
          if (dupleCheck) {
            alert('이미 존재하는 컬럼입니다.');
            return;
          }
          // TODO: 추후 데이터 항목 contextMenu 기능 추가시 데이터 교체 필요
          // 현재는 해당 기능이 필요 없으므로 아이템 복제만 함.
          // 정렬 기준 항목에서 측정값으로 이동시 summaryType 기본값 설정
          if (source.droppableId === 'sortByItem') {
            sourceField['summaryType'] = 'COUNT';

            if (sourceField.fieldType === 'MEA' && sourceField.type === 'MEA') {
              sourceField['summaryType'] = 'SUM';
            }
          }
          // 측정값에서 정렬 기준 항목으로 이동시 summaryType 기본값 설정
          if (dest.droppableId === 'sortByItem') {
            sourceField['summaryType'] = 'MIN';

            if (sourceField.fieldType === 'MEA' && sourceField.type === 'MEA') {
              sourceField['summaryType'] = 'SUM';
            }
          }
          dataField[dest.droppableId].splice(dest.index, 0, sourceField);

          if (checkFieldLimit()) {
            dispatch(setItemField({reportId, dataField}));
          }
        }
      }
    } else if (source.droppableId != 'dataSource') {
      // 데이터 항목을 끌어다 허공에 놓는 경우 삭제
      dataField[source.droppableId].splice(source.index, 1);
      // 측정값 항목에서 측정값을 허공에 놓는 경우 시리즈옵션도 제거.
      if (dataField['seriesOptions'] && source.droppableId === 'measure') {
        dataField['seriesOptions'].splice(source.index, 1);
      }
      dispatch(setItemField({reportId, dataField}));
    }
  };

  return {onDragStart, onDragEnd};
};

export default useDrag;
